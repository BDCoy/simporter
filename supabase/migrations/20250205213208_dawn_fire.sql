/*
  # Add proprietary data tables

  1. New Tables
    - `user_roles`
      - Stores user roles and permissions
    - `product_data`
      - Product-specific information including reviews and metrics
    - `social_data`
      - Social media engagement and metrics
    - `review_data`
      - Aggregated review metrics and analysis

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create user roles table first
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'user')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Users can read their own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Only owners can manage roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- Product Data Table
CREATE TABLE IF NOT EXISTS product_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  category text NOT NULL,
  subcategory text NOT NULL,
  brand text,
  product text NOT NULL,
  link text,
  review_mentions bigint,
  ai_score numeric,
  share_of_voice numeric,
  consumer_passion numeric,
  example_reviews jsonb,
  strengths text[],
  weaknesses text[],
  created_at timestamptz DEFAULT now()
);

-- Social Data Table
CREATE TABLE IF NOT EXISTS social_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  category text NOT NULL,
  subcategory text NOT NULL,
  attribute text NOT NULL,
  post_count bigint,
  top_likes bigint,
  ai_score numeric,
  share_of_voice numeric,
  consumer_passion numeric,
  example_posts jsonb,
  created_at timestamptz DEFAULT now()
);

-- Review Data Table
CREATE TABLE IF NOT EXISTS review_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  category text NOT NULL,
  subcategory text NOT NULL,
  attribute text NOT NULL,
  review_mentions bigint,
  ai_score numeric,
  share_of_voice numeric,
  consumer_passion numeric,
  example_reviews jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE product_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_data ENABLE ROW LEVEL SECURITY;

-- Create policies for product_data
CREATE POLICY "Authenticated users can read product data"
  ON product_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can insert product data"
  ON product_data
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- Create policies for social_data
CREATE POLICY "Authenticated users can read social data"
  ON social_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can insert social data"
  ON social_data
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- Create policies for review_data
CREATE POLICY "Authenticated users can read review data"
  ON review_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can insert review data"
  ON review_data
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- Create indexes for better query performance
CREATE INDEX product_data_category_idx ON product_data(category, subcategory);
CREATE INDEX social_data_category_idx ON social_data(category, subcategory);
CREATE INDEX review_data_category_idx ON review_data(category, subcategory);

CREATE INDEX product_data_search_idx ON product_data USING gin(to_tsvector('english', product || ' ' || coalesce(brand, '')));
CREATE INDEX social_data_search_idx ON social_data USING gin(to_tsvector('english', attribute));
CREATE INDEX review_data_search_idx ON review_data USING gin(to_tsvector('english', attribute));