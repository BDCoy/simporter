# Simporter TypeScript SDK Examples

This directory contains example code for common operations using the Simporter TypeScript SDK.

## Installation

```bash
npm install @simporter/sdk
```

## Basic Usage

```typescript
import { SimporterClient } from '@simporter/sdk';
import type { TestConfig, TestResults } from '@simporter/sdk';

// Initialize client
const client = new SimporterClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production' // or 'sandbox' for testing
});

// Create a test
async function createConceptTest() {
  const config: TestConfig = {
    name: "Premium Shampoo Concept Test",
    type: "monadic",
    targetResponses: 500,
    audience: [
      {
        type: "demographic",
        attribute: "age",
        operator: "between",
        value: ["25", "45"]
      }
    ],
    content: [
      {
        type: "product",
        name: "Eco-Friendly Shampoo",
        description: "Natural ingredients, sustainable packaging",
        url: "https://example.com/product.jpg",
        metadata: {
          category: "Hair Care",
          brand: "NatureCare"
        }
      }
    ]
  };

  try {
    const test = await client.tests.create(config);
    console.log('Test created:', test.id);
    return test;
  } catch (error) {
    console.error('Error creating test:', error);
    throw error;
  }
}

// Get test results
async function getTestResults(testId: string) {
  try {
    const results = await client.tests.getResults(testId);
    console.log('Test results:', results);
    return results;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
}

// Set up webhook handler
import express from 'express';
const app = express();

app.post('/webhooks/simporter', express.json(), (req, res) => {
  const signature = req.headers['x-simporter-signature'];
  
  if (!client.webhooks.verifySignature(signature, req.body)) {
    return res.status(400).send('Invalid signature');
  }

  const { event, test_id } = req.body;

  switch (event) {
    case 'test.status_changed':
      handleStatusChange(test_id, req.body);
      break;
    case 'test.threshold_reached':
      handleThresholdReached(test_id, req.body);
      break;
    default:
      console.log('Unknown event:', event);
  }

  res.sendStatus(200);
});

// Example implementation
async function main() {
  // Create test
  const test = await createConceptTest();

  // Poll for results
  const checkResults = setInterval(async () => {
    const results = await getTestResults(test.id);
    if (results.status === 'completed') {
      clearInterval(checkResults);
      console.log('Final results:', results);
      
      // Export to CSV
      const csv = await client.tests.export(test.id, {
        format: 'csv',
        includeMetadata: true
      });
      
      // Save CSV
      await fs.writeFile('results.csv', csv);
    }
  }, 60000); // Check every minute
}

main().catch(console.error);
```

## Error Handling

```typescript
import { SimporterError, ValidationError, RateLimitError } from '@simporter/sdk';

try {
  await client.tests.create(config);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid configuration:', error.details);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded. Retry after:', error.retryAfter);
  } else if (error instanceof SimporterError) {
    console.error('API error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Batch Operations

```typescript
// Upload multiple responses
const responses = [
  {
    respondentId: 'resp-1',
    timestamp: new Date().toISOString(),
    responses: {
      purchase_intent: 4,
      uniqueness: 5
    }
  },
  // ... more responses
];

await client.tests.submitResponses(testId, responses, {
  validateOnly: true // Optional dry run
});

// Export multiple tests
const testIds = ['test-1', 'test-2', 'test-3'];
const exports = await client.tests.exportBatch(testIds, {
  format: 'csv',
  compression: 'zip'
});
```

## Webhook Handling

```typescript
import crypto from 'crypto';

function verifyWebhook(
  signature: string,
  payload: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// Express middleware
function validateWebhook(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['x-simporter-signature'];
  if (!signature || !verifyWebhook(signature, JSON.stringify(req.body), WEBHOOK_SECRET)) {
    return res.status(400).send('Invalid signature');
  }
  next();
}
```

## Advanced Configuration

```typescript
const client = new SimporterClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production',
  timeout: 30000, // 30 seconds
  retries: 3,
  baseURL: 'https://api.simporter.com/v1',
  headers: {
    'User-Agent': 'MyApp/1.0.0'
  },
  hooks: {
    beforeRequest: (config) => {
      console.log('Making request:', config);
      return config;
    },
    afterResponse: (response) => {
      console.log('Received response:', response.status);
      return response;
    }
  }
});
```