import { pool } from '../database/db.js';
import { getEmbeddingProvider } from '../embeddings/embedder.js';

export interface RetrievedChunk {
  id: string;
  documentId: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
}

export async function hybridSearch(query: string, topK: number = 5): Promise<RetrievedChunk[]> {
  const embedder = getEmbeddingProvider();
  const queryVector = await embedder.generateEmbedding(query);
  const vectorStr = `[${queryVector.join(',')}]`;

  // Hybrid Query: RRF (Reciprocal Rank Fusion) combining Vector Cosine Distance & Full-Text Search
  const sql = `
    WITH vector_search AS (
      SELECT 
        id, 
        document_id, 
        content, 
        metadata,
        ROW_NUMBER() OVER (ORDER BY embedding <=> $1::vector) as rank_vec
      FROM document_chunks
      WHERE embedding IS NOT NULL
      LIMIT $2
    ),
    text_search AS (
      SELECT 
        id, 
        document_id, 
        content, 
        metadata,
        ROW_NUMBER() OVER (ORDER BY ts_rank(tsv, plainto_tsquery('portuguese', $3)) DESC) as rank_text
      FROM document_chunks
      WHERE tsv @@ plainto_tsquery('portuguese', $3)
      LIMIT $2
    )
    SELECT 
      COALESCE(v.id, t.id) as id,
      COALESCE(v.document_id, t.document_id) as "documentId",
      COALESCE(v.content, t.content) as content,
      COALESCE(v.metadata, t.metadata) as metadata,
      (
        COALESCE(1.0 / (60 + v.rank_vec), 0.0) +
        COALESCE(1.0 / (60 + t.rank_text), 0.0)
      ) as score
    FROM vector_search v
    FULL OUTER JOIN text_search t ON v.id = t.id
    ORDER BY score DESC
    LIMIT $2;
  `;

  const result = await pool.query(sql, [vectorStr, topK, query]);
  return result.rows;
}
