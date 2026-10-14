import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { parse as csvParse } from 'csv-parse/sync';

export interface ParsedDocument {
  text: string;
  metadata: Record<string, any>;
}

export async function parseDocument(buffer: Buffer, mimeType: string, filename: string): Promise<ParsedDocument> {
  let text = '';

  if (mimeType === 'application/pdf' || filename.endsWith('.pdf')) {
    const data = await pdfParse(buffer);
    text = data.text;
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    filename.endsWith('.docx')
  ) {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else if (mimeType === 'text/csv' || filename.endsWith('.csv')) {
    const records = csvParse(buffer, { columns: true, skip_empty_lines: true });
    text = records.map((r: any) => Object.entries(r).map(([k, v]) => `${k}: ${v}`).join(' | ')).join('\n');
  } else {
    // Default plain text
    text = buffer.toString('utf-8');
  }

  return {
    text: text.trim(),
    metadata: {
      filename,
      mimeType,
      sizeBytes: buffer.length,
    },
  };
}
