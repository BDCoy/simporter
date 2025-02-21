/*
  # Add scraped data table

  1. New Tables
    - `scraped_data`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `url` (text)
      - `query` (text)
      - `scraped_at` (timestamp)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `scraped_data` table
    - Add policy for authenticated users to read data
*/

CREATE TABLE IF NOT EXISTS scraped_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  url text NOT NULL,
  query text NOT NULL,
  scraped_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE scraped_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read scraped data"
  ON scraped_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert scraped data"
  ON scraped_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create index for faster text search
CREATE INDEX scraped_data_query_idx ON scraped_data USING gin(to_tsvector('english', query));
CREATE INDEX scraped_data_content_idx ON scraped_data USING gin(to_tsvector('english', content));