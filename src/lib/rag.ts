import { supabase } from './supabase';
import { streamAIResponse } from './ai';

interface Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding: number[];
}

interface SearchResult {
  document: Document;
  similarity: number;
}

export class RAGService {
  private static instance: RAGService;
  private documents: Document[] = [];
  private initialized = false;

  private constructor() {}

  static getInstance(): RAGService {
    if (!RAGService.instance) {
      RAGService.instance = new RAGService();
    }
    return RAGService.instance;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Fetch documents and their embeddings from Supabase
      const { data: documents, error } = await supabase
        .from('documents')
        .select('*');

      if (error) throw error;
      
      this.documents = documents || [];
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize RAG service:', error);
      throw error;
    }
  }

  private async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
        },
        body: JSON.stringify({
          input: text,
          model: 'text-embedding-3-small'
        })
      });

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('Failed to get embedding:', error);
      throw error;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async search(query: string, topK: number = 3): Promise<SearchResult[]> {
    await this.initialize();

    const queryEmbedding = await this.getEmbedding(query);
    
    const results = this.documents
      .map(doc => ({
        document: doc,
        similarity: this.cosineSimilarity(queryEmbedding, doc.embedding)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    return results;
  }

  async generateResponse(query: string): AsyncGenerator<string, any> {
    const relevantDocs = await this.search(query);
    
    const context = relevantDocs
      .map(result => result.document.content)
      .join('\n\n');

    const prompt = `
      Context:
      ${context}

      Question:
      ${query}

      Please provide a detailed response based on the context above.
    `;

    return streamAIResponse(prompt);
  }
}

export const ragService = RAGService.getInstance();