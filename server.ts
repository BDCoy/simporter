import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';
import type { Request, Response, NextFunction } from 'express';

config();

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set in environment variables');
  process.exit(1);
}

const app = express();
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    const requestsLimit = res.getHeader('anthropic-ratelimit-requests-limit');
    const requestsRemaining = res.getHeader('anthropic-ratelimit-requests-remaining');
    const tokensLimit = res.getHeader('anthropic-ratelimit-tokens-limit');
    const tokensRemaining = res.getHeader('anthropic-ratelimit-tokens-remaining');

    if (requestsRemaining && Number(requestsRemaining) < 10) {
      console.warn(`Rate limit warning: Only ${requestsRemaining} requests remaining`);
    }
    if (tokensRemaining && Number(tokensRemaining) < 1000) {
      console.warn(`Token limit warning: Only ${tokensRemaining} tokens remaining`);
    }
  });
  next();
};

app.use(rateLimitMiddleware);

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Code Analysis API is running' });
});

app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { query, code } = req.body;

    if (!query || !code) {
      return res.status(400).json({
        type: 'error',
        error: {
          type: 'invalid_request_error',
          message: 'Missing required parameters: query and code'
        }
      });
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this code query: ${query}\n\nCode:\n${code}\n\nProvide a detailed analysis including:\n1. Code quality assessment\n2. Potential improvements\n3. Security considerations\n4. Best practices recommendations`
          }
        ]
      }],
      stream: false
    });

    const rateLimitHeaders = [
      'anthropic-ratelimit-requests-limit',
      'anthropic-ratelimit-requests-remaining',
      'anthropic-ratelimit-tokens-limit',
      'anthropic-ratelimit-tokens-remaining'
    ];

    rateLimitHeaders.forEach(header => {
      const value = res.getHeader(header);
      if (value) {
        res.setHeader(header, value);
      }
    });

    res.json({ analysis: message.content[0].text });
  } catch (error: any) {
    console.error('Error calling Claude API:', error);

    if (error.status === 401) {
      return res.status(401).json({
        type: 'error',
        error: {
          type: 'authentication_error',
          message: 'Invalid API key'
        }
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        type: 'error',
        error: {
          type: 'rate_limit_error',
          message: 'Rate limit exceeded. Please try again later.'
        }
      });
    }

    if (error.status === 529) {
      return res.status(529).json({
        type: 'error',
        error: {
          type: 'overloaded_error',
          message: 'The API is currently overloaded. Please try again later.'
        }
      });
    }

    res.status(500).json({
      type: 'error',
      error: {
        type: 'api_error',
        message: 'Failed to analyze code'
      }
    });
  }
});

const PORT = process.env.PORT || 3001;

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});