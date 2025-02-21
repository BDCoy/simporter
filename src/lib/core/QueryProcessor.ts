import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { streamAIResponse } from '../ai';
import { aiService } from '../ai-service';

export interface QueryContext {
  id: string;
  query: string;
  timestamp: Date;
  intent?: string;
  parameters?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ProcessingResult {
  context: QueryContext;
  data: any[];
  response: string;
  code: string;
  status: 'success' | 'error';
  error?: Error;
}

export class QueryProcessor extends EventEmitter {
  private static instance: QueryProcessor;
  private abortController: AbortController | null = null;

  private constructor() {
    super();
  }

  static getInstance(): QueryProcessor {
    if (!QueryProcessor.instance) {
      QueryProcessor.instance = new QueryProcessor();
    }
    return QueryProcessor.instance;
  }

  async processQuery(query: string): Promise<ProcessingResult> {
    // Create query context
    const context: QueryContext = {
      id: uuidv4(),
      query,
      timestamp: new Date()
    };

    try {
      // Abort any existing processing
      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();

      // Emit processing start event
      this.emit('processingStart', context);

      // Parse intent and parameters
      const { intent, parameters } = await this.parseQuery(query);
      context.intent = intent;
      context.parameters = parameters;

      // Start AI service processing
      const response = await aiService.processQuery(query);

      // Create final result
      const result: ProcessingResult = {
        context,
        data: [],
        response,
        code: '',
        status: 'success'
      };

      this.emit('processingComplete', result);
      return result;

    } catch (error) {
      const errorResult: ProcessingResult = {
        context,
        data: [],
        response: '',
        code: '',
        status: 'error',
        error: error as Error
      };

      this.emit('processingError', errorResult);
      throw error;
    }
  }

  private async parseQuery(query: string): Promise<{ intent: string; parameters: Record<string, any> }> {
    // Parse command-based queries
    const commandMatch = query.match(/^\/(\w+)\s*(.*)/);
    
    if (commandMatch) {
      return {
        intent: commandMatch[1],
        parameters: {
          args: commandMatch[2].trim()
        }
      };
    }

    // Parse natural language queries
    const nlpResult = await this.analyzeNaturalLanguage(query);
    return {
      intent: nlpResult.intent,
      parameters: nlpResult.parameters
    };
  }

  private async analyzeNaturalLanguage(query: string) {
    // Simplified NLP analysis - in production, use a proper NLP service
    const keywords = {
      analyze: ['analyze', 'study', 'examine', 'investigate'],
      compare: ['compare', 'versus', 'vs', 'against'],
      predict: ['predict', 'forecast', 'estimate', 'project'],
      summarize: ['summarize', 'overview', 'brief', 'summary']
    };

    const words = query.toLowerCase().split(' ');
    let intent = 'analyze'; // Default intent

    for (const [key, values] of Object.entries(keywords)) {
      if (values.some(word => words.includes(word))) {
        intent = key;
        break;
      }
    }

    return {
      intent,
      parameters: {
        query: query,
        keywords: words
      }
    };
  }

  abort() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

export const queryProcessor = QueryProcessor.getInstance();