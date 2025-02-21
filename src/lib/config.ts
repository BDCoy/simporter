import { z } from 'zod';

const configSchema = z.object({
  apiKey: z.string().min(1, 'Claude API key is required'),
  supabaseUrl: z.string().url('Invalid Supabase URL'),
  supabaseAnonKey: z.string().min(1, 'Supabase anon key is required'),
});

export type Config = z.infer<typeof configSchema>;

const config = {
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY || '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
} as const;

export const validateConfig = () => {
  try {
    return configSchema.parse(config);
  } catch (error) {
    console.error('Configuration error:', error);
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => issue.message).join(', ');
      throw new Error(`Configuration validation failed: ${issues}`);
    }
    throw error;
  }
};

export default config;