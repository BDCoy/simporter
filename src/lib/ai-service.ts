import { streamAIResponse } from './ai';
import { presentationBuilder } from './core/PresentationBuilder';
import { getCommand, getSystemPrompt } from './commands';
import type { Slide } from './core/PresentationBuilder';

interface ProcessingResult {
  response: string;
  slides: Slide[];
  tokens_used: number;
}

class AIService {
  private abortController: AbortController | null = null;

  async processQuery(query: string, onChunk?: (chunk: string) => void): Promise<ProcessingResult> {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    try {
      // Get command and system prompt if applicable
      const command = getCommand(query);
      const systemPrompt = getSystemPrompt(query);

      // Initialize response accumulator
      let fullResponse = '';

      // Stream the AI response
      const stream = streamAIResponse(query, systemPrompt);
      for await (const chunk of stream) {
        fullResponse += chunk;
        onChunk?.(chunk);
      }

      // Generate slides from the response
      const slides = presentationBuilder.generateFromOutline(fullResponse);

      return {
        response: fullResponse,
        slides,
        tokens_used: Math.ceil(fullResponse.length / 4)
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    } finally {
      this.abortController = null;
    }
  }

  abort() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

export const aiService = new AIService();