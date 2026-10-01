import { FastifyInstance } from 'fastify';
import { IngestDocumentSchema, ChatQuerySchema } from '../schemas/rag.schema.js';
import { parseDocument } from '../ingestion/parser.js';
import { splitTextIntoChunks } from '../chunking/chunker.js';
import { getEmbeddingProvider } from '../embeddings/embedder.js';
import { hybridSearch } from '../retriever/hybridRetriever.js';
import { rerankAndBuildPrompt } from '../reranker/reranker.js';
import { pool, checkDatabaseHealth } from '../database/db.js';
import crypto from 'crypto';

export async function ragRoutes(fastify: FastifyInstance) {
  // Healthcheck
  fastify.get('/api/health', async (request, reply) => {
    const isDbOk = await checkDatabaseHealth();
    return reply.send({
      status: isDbOk ? 'healthy' : 'degraded',
      database: isDbOk ? 'connected (pgvector ready)' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  });

  // Ingestion Route
  fastify.post('/api/ingest', async (request, reply) => {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ error: 'Nenhum arquivo enviado.' });
    }

    const buffer = await data.toBuffer();
    const parsed = await parseDocument(buffer, data.mimetype, data.filename);
    const chunks = await splitTextIntoChunks(parsed.text, 1000, 200, parsed.metadata);

    const docId = `doc_${crypto.randomBytes(8).toString('hex')}`;
    const embedder = getEmbeddingProvider();

    // Persist Document
    await pool.query(
      'INSERT INTO documents (id, filename, mime_type, metadata) VALUES ($1, $2, $3, $4)',
      [docId, data.filename, data.mimetype, JSON.stringify(parsed.metadata)]
    );

    // Generate Embeddings & Persist Chunks
    for (const chunk of chunks) {
      const chunkId = `chk_${crypto.randomBytes(8).toString('hex')}`;
      const embedding = await embedder.generateEmbedding(chunk.content);
      const vecStr = `[${embedding.join(',')}]`;

      await pool.query(
        `INSERT INTO document_chunks (id, document_id, content, chunk_index, metadata, embedding)
         VALUES ($1, $2, $3, $4, $5, $6::vector)`,
        [chunkId, docId, chunk.content, chunk.chunkIndex, JSON.stringify(chunk.metadata), vecStr]
      );
    }

    return reply.send({
      success: true,
      documentId: docId,
      filename: data.filename,
      chunksCreated: chunks.length,
    });
  });

  // Chat / RAG Query with Streaming Support
  fastify.post('/api/chat', async (request, reply) => {
    const body = ChatQuerySchema.parse(request.body);
    const retrieved = await hybridSearch(body.query, body.topK);
    const { chunks, contextText } = rerankAndBuildPrompt(retrieved, body.query, body.similarityThreshold);

    if (body.stream) {
      reply.raw.setHeader('Content-Type', 'text/event-stream');
      reply.raw.setHeader('Cache-Control', 'no-cache');
      reply.raw.setHeader('Connection', 'keep-alive');

      // Send sources first
      reply.raw.write(`event: sources\ndata: ${JSON.stringify(chunks)}\n\n`);

      // Mock streaming generator response
      const responseTemplate = `Com base nos documentos consultados no RAG: ${chunks.length > 0 ? 'Encontrei informações pertinentes no contexto.' : 'Nenhuma fonte direta encontrada.'}`;
      const tokens = responseTemplate.split(' ');

      for (const token of tokens) {
        reply.raw.write(`event: token\ndata: ${JSON.stringify({ token: `${token} ` })}\n\n`);
        await new Promise((res) => setTimeout(res, 50));
      }

      reply.raw.write('event: done\ndata: [DONE]\n\n');
      return reply.raw.end();
    }

    return reply.send({
      query: body.query,
      sources: chunks,
      contextLength: contextText.length,
    });
  });
}
