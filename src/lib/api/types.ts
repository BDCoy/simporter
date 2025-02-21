import { z } from 'zod';

// Common Types
export const ConceptType = z.enum(['monadic', 'shelf', 'price', 'packaging', 'claims']);
export const TestStatus = z.enum(['draft', 'running', 'completed', 'analyzing']);

// Audience Criteria Schema
export const AudienceCriterion = z.object({
  type: z.enum(['demographic', 'geographic', 'behavioral', 'psychographic']),
  attribute: z.string(),
  operator: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
});

// Content Item Schema
export const ContentItem = z.object({
  type: z.enum(['product', 'image', 'document', 'video', 'link']),
  name: z.string(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Test Configuration Schema
export const TestConfig = z.object({
  name: z.string(),
  type: ConceptType,
  targetResponses: z.number().min(100),
  audience: z.array(AudienceCriterion),
  content: z.array(ContentItem),
  settings: z.object({
    randomization: z.boolean().default(true),
    maxDuration: z.number().optional(),
    requireQualification: z.boolean().default(true),
  }).optional(),
});

// Response Data Schema
export const ResponseData = z.object({
  testId: z.string().uuid(),
  respondentId: z.string().uuid(),
  timestamp: z.string().datetime(),
  responses: z.record(z.unknown()),
  metadata: z.object({
    duration: z.number(),
    device: z.string(),
    browser: z.string(),
    location: z.object({
      country: z.string(),
      region: z.string().optional(),
    }),
  }),
});

// Results Schema
export const TestResults = z.object({
  testId: z.string().uuid(),
  status: TestStatus,
  summary: z.object({
    totalResponses: z.number(),
    completionRate: z.number(),
    averageDuration: z.number(),
  }),
  data: z.array(ResponseData),
  analysis: z.record(z.unknown()).optional(),
});

// Export types
export type ConceptType = z.infer<typeof ConceptType>;
export type TestStatus = z.infer<typeof TestStatus>;
export type AudienceCriterion = z.infer<typeof AudienceCriterion>;
export type ContentItem = z.infer<typeof ContentItem>;
export type TestConfig = z.infer<typeof TestConfig>;
export type ResponseData = z.infer<typeof ResponseData>;
export type TestResults = z.infer<typeof TestResults>;