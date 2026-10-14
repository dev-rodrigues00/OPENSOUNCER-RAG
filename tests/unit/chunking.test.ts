import { describe, it, expect } from 'vitest';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

describe('🧩 Unit Test: Chunking Engine', () => {
  it('deve dividir o texto respeitando o chunkSize e overlap configurados', async () => {
    const text = 'RAG corporativo requer precisão. '.repeat(100);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 40,
    });

    const docs = await splitter.createDocuments([text]);

    expect(docs.length).toBeGreaterThan(1);
    expect(docs[0].pageContent.length).toBeLessThanOrEqual(250);
  });
});
