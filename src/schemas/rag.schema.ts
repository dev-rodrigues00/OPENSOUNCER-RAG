import { z } from 'zod';

// Esquema de Ingestão de Documentos
export const IngestDocumentSchema = z.object({
  metadata: z.record(z.any()).optional().default({}),
  chunkSize: z.coerce.number().min(100).max(4000).default(1000),
  chunkOverlap: z.coerce.number().min(0).max(1000).default(200),
});

export type IngestDocumentInput = z.infer<typeof IngestDocumentSchema>;

// Esquema de Chat / Consulta RAG
export const ChatQuerySchema = z.object({
  query: z
    .string({ required_error: 'A query do usuário é obrigatória.' })
    .min(3, 'A query deve ter no mínimo 3 caracteres.')
    .max(2000, 'A query excedeu o limite de 2000 caracteres.'),
  topK: z.number().int().min(1).max(20).default(5),
  similarityThreshold: z.number().min(0).max(1).default(0.7),
  stream: z.boolean().default(true),
  filter: z.record(z.any()).optional(),
});

export type ChatQueryInput = z.infer<typeof ChatQuerySchema>;
