/*
  # Token Usage Tracking Schema

  1. New Tables
    - `token_usage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `tokens_used` (integer)
      - `request_type` (text)
      - `created_at` (timestamp)
    - `token_limits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `monthly_limit` (integer)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for user access
*/

-- Token Usage Table
CREATE TABLE IF NOT EXISTS token_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  tokens_used integer NOT NULL,
  request_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Token Limits Table
CREATE TABLE IF NOT EXISTS token_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
  monthly_limit integer NOT NULL DEFAULT 100000,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_limits ENABLE ROW LEVEL SECURITY;

-- Policies for token_usage
CREATE POLICY "Users can read their own token usage"
  ON token_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own token usage"
  ON token_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for token_limits
CREATE POLICY "Users can read their own token limits"
  ON token_limits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX token_usage_user_id_created_at_idx ON token_usage(user_id, created_at);
CREATE INDEX token_limits_user_id_idx ON token_limits(user_id);

-- Create function to get monthly token usage
CREATE OR REPLACE FUNCTION get_monthly_token_usage(user_uuid uuid)
RETURNS integer AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(tokens_used)
     FROM token_usage
     WHERE user_id = user_uuid
     AND created_at >= date_trunc('month', CURRENT_DATE)),
    0
  );
END;
$$ LANGUAGE plpgsql;