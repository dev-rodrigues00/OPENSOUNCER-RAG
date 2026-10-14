import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgrespassword@localhost:5432/enterprise_rag_db'),
  EMBEDDING_PROVIDER: z.enum(['openai', 'ollama']).default('openai'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
  OPENAI_CHAT_MODEL: z.string().default('gpt-4o-mini'),
  OLLAMA_BASE_URL: z.string().default('http://localhost:11434'),
  OLLAMA_EMBEDDING_MODEL: z.string().default('bge-m3'),
  OLLAMA_CHAT_MODEL: z.string().default('llama3.1'),
  TOP_K_RETRIEVAL: z.coerce.number().default(5),
});

export const env = envSchema.parse(process.env);
