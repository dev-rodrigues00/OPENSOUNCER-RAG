import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export interface Chunk {
  content: string;
  chunkIndex: number;
  metadata: Record<string, any>;
}

export async function splitTextIntoChunks(
  text: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200,
  baseMetadata: Record<string, any> = {}
): Promise<Chunk[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: ['\n\n', '\n', ' ', ''],
  });

  const docs = await splitter.createDocuments([text]);

  return docs.map((doc, index) => ({
    content: doc.pageContent,
    chunkIndex: index,
    metadata: {
      ...baseMetadata,
      length: doc.pageContent.length,
    },
  }));
}
