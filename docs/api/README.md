# Simporter API Documentation

Welcome to the Simporter API documentation. This guide explains how to integrate with our concept testing platform using our REST APIs.

## Authentication

All API requests require authentication using an API key. Include your API key in the `Authorization` header:

```http
Authorization: Bearer YOUR_API_KEY
```

To obtain an API key, visit your account settings in the Simporter dashboard.

## Base URL

```
https://api.simporter.com/v1
```

## Rate Limits

- 1000 requests per minute for standard plans
- 5000 requests per minute for enterprise plans
- Responses include rate limit headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Inbound API (External → Simporter)

### Create Test

Create a new concept test.

```http
POST /tests
Content-Type: application/json
```

Request body:
```json
{
  "name": "Product Concept Test Q1 2025",
  "type": "monadic",
  "targetResponses": 500,
  "audience": [
    {
      "type": "demographic",
      "attribute": "age",
      "operator": "between",
      "value": ["25", "45"]
    },
    {
      "type": "behavioral",
      "attribute": "purchase_frequency",
      "operator": "minimum",
      "value": "monthly"
    }
  ],
  "content": [
    {
      "type": "product",
      "name": "Premium Shampoo Concept",
      "description": "Eco-friendly hair care with natural ingredients",
      "url": "https://example.com/concept.jpg",
      "metadata": {
        "category": "Hair Care",
        "brand": "NatureCare",
        "price_point": "$12.99"
      }
    }
  ],
  "settings": {
    "randomization": true,
    "maxDuration": 900,
    "requireQualification": true
  }
}
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "draft",
  "created_at": "2025-02-20T12:00:00Z",
  "config": { ... },
  "_links": {
    "self": "/tests/550e8400-e29b-41d4-a716-446655440000",
    "results": "/tests/550e8400-e29b-41d4-a716-446655440000/results"
  }
}
```

### Submit Response

Submit a response for a test.

```http
POST /tests/{testId}/responses
Content-Type: application/json
```

Request body:
```json
{
  "respondentId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "timestamp": "2025-02-20T12:30:00Z",
  "responses": {
    "purchase_intent": 4,
    "uniqueness": 5,
    "price_perception": "somewhat_high",
    "open_feedback": "Love the eco-friendly packaging!"
  },
  "metadata": {
    "duration": 450,
    "device": "mobile",
    "browser": "chrome",
    "location": {
      "country": "US",
      "region": "CA"
    }
  }
}
```

Response:
```json
{
  "id": "8f9e6679-7425-40de-944b-e07fc1f90ae7",
  "status": "accepted",
  "validation": {
    "passed": true,
    "checks": ["completion", "duration", "quality"]
  }
}
```

### Get Test Results

Retrieve results for a completed test.

```http
GET /tests/{testId}/results
```

Response:
```json
{
  "testId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "summary": {
    "totalResponses": 523,
    "completionRate": 0.95,
    "averageDuration": 420
  },
  "data": [...],
  "analysis": {
    "purchase_intent": {
      "mean": 4.2,
      "distribution": {...}
    },
    "key_themes": [...],
    "recommendations": [...]
  }
}
```

## Outbound API (Simporter → External)

### Webhooks

Subscribe to real-time updates by configuring webhooks in your dashboard.

#### Test Status Updates

```http
POST {your_webhook_url}
Content-Type: application/json
X-Simporter-Signature: {hmac_signature}
```

Payload:
```json
{
  "event": "test.status_changed",
  "test_id": "550e8400-e29b-41d4-a716-446655440000",
  "previous_status": "running",
  "new_status": "completed",
  "timestamp": "2025-02-21T15:00:00Z"
}
```

#### Response Threshold Reached

```http
POST {your_webhook_url}
Content-Type: application/json
X-Simporter-Signature: {hmac_signature}
```

Payload:
```json
{
  "event": "test.threshold_reached",
  "test_id": "550e8400-e29b-41d4-a716-446655440000",
  "threshold": 500,
  "current_responses": 502,
  "timestamp": "2025-02-21T14:30:00Z"
}
```

### Data Export

Export test results in various formats.

#### CSV Export

```http
GET /tests/{testId}/export?format=csv
Accept: text/csv
```

Response:
```csv
respondent_id,timestamp,purchase_intent,uniqueness,price_perception,open_feedback
7c9e6679-7425-40de-944b-e07fc1f90ae7,2025-02-20T12:30:00Z,4,5,somewhat_high,"Love the eco-friendly packaging!"
...
```

#### SPSS Export

```http
GET /tests/{testId}/export?format=spss
Accept: application/x-spss
```

Response: Binary SPSS file

## Error Handling

All errors follow a standard format:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Invalid audience criteria specified",
    "details": [{
      "field": "audience[0].value",
      "message": "Age range must be numeric"
    }]
  }
}
```

Common HTTP status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## SDKs & Client Libraries

Official SDKs are available for:
- JavaScript/TypeScript
- Python
- R
- Ruby

Example using TypeScript SDK:

```typescript
import { SimporterClient } from '@simporter/sdk';

const client = new SimporterClient('YOUR_API_KEY');

// Create a test
const test = await client.tests.create({
  name: 'Product Concept Test',
  type: 'monadic',
  targetResponses: 500,
  // ... other config
});

// Get results
const results = await client.tests.getResults(test.id);
```

## Best Practices

1. **Rate Limiting**
   - Implement exponential backoff for retry logic
   - Cache responses when appropriate
   - Use bulk endpoints for multiple operations

2. **Webhook Handling**
   - Verify webhook signatures
   - Process webhooks asynchronously
   - Implement idempotency checks

3. **Error Handling**
   - Always check error responses
   - Log errors with request IDs
   - Implement proper fallback behavior

4. **Security**
   - Never expose API keys in client-side code
   - Use HTTPS for all requests
   - Rotate API keys periodically

## Support

For technical support:
- Email: api-support@simporter.com
- API Status: status.simporter.com
- Documentation: docs.simporter.com