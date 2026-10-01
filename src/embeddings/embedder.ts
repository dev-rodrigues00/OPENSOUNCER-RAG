import { OpenAIEmbeddings } from '@langchain/openai';
import { env } from '../config/env.js';

export interface EmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
  generateEmbeddings(texts: string[]): Promise<number[][]>;
}

class OpenAIEmbeddingService implements EmbeddingProvider {
  private client: OpenAIEmbeddings;

  constructor() {
    this.client = new OpenAIEmbeddings({
      openAIApiKey: env.OPENAI_API_KEY,
      modelName: env.OPENAI_EMBEDDING_MODEL,
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    return this.client.embedQuery(text);
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    return this.client.embedDocuments(texts);
  }
}

class OllamaEmbeddingService implements EmbeddingProvider {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = env.OLLAMA_BASE_URL;
    this.model = env.OLLAMA_EMBEDDING_MODEL;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const res = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: this.model, prompt: text }),
    });
    const data = (await res.json()) as { embedding: number[] };
    return data.embedding;
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.generateEmbedding(t)));
  }
}

export function getEmbeddingProvider(): EmbeddingProvider {
  if (env.EMBEDDING_PROVIDER === 'ollama') {
    return new OllamaEmbeddingService();
  }
  return new OpenAIEmbeddingService();
}
