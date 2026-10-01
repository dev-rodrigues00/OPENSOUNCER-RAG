import { RetrievedChunk } from '../retriever/hybridRetriever.js';

export interface RerankedResult {
  chunks: RetrievedChunk[];
  contextText: string;
}

export function rerankAndBuildPrompt(chunks: RetrievedChunk[], query: string, similarityThreshold: number = 0.01): RerankedResult {
  // Filter out low scores and sort
  const validChunks = chunks
    .filter((c) => c.score >= similarityThreshold)
    .sort((a, b) => b.score - a.score);

  const contextText = validChunks
    .map((c, i) => `[FONTE ${i + 1} | Documento: ${c.metadata?.filename || c.documentId}]\n${c.content}`)
    .join('\n\n---\n\n');

  return {
    chunks: validChunks,
    contextText,
  };
}
