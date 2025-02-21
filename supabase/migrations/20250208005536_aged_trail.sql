/*
  # Library Content Tables

  1. New Tables
    - `library_content`
      - Core table for all library items
      - Supports different content types (news, video, podcast, report, data, consultant, integration)
      - Includes pricing for paid content
    - `library_downloads`
      - Tracks user downloads/access
    - `library_integrations`
      - Stores integration configurations and installation status

  2. Security
    - Enable RLS on all tables
    - Only owner can insert/update content
    - Authenticated users can read content
    - Users can track their own downloads
*/

-- Library Content Table
CREATE TABLE IF NOT EXISTS library_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('news', 'video', 'podcast', 'report', 'data', 'consultant', 'integration')),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  content_url text NOT NULL,
  category text NOT NULL,
  tags text[],
  is_featured boolean DEFAULT false,
  is_paid boolean DEFAULT false,
  price numeric DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Library Downloads Table
CREATE TABLE IF NOT EXISTS library_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES library_content(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  downloaded_at timestamptz DEFAULT now(),
  UNIQUE(content_id, user_id)
);

-- Library Integrations Table
CREATE TABLE IF NOT EXISTS library_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES library_content(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'installed',
  config jsonb DEFAULT '{}'::jsonb,
  installed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(content_id, user_id)
);

-- Enable RLS
ALTER TABLE library_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_integrations ENABLE ROW LEVEL SECURITY;

-- Library Content Policies
CREATE POLICY "Authenticated users can read library content"
  ON library_content
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only owners can manage library content"
  ON library_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- Library Downloads Policies
CREATE POLICY "Users can see their own downloads"
  ON library_downloads
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create download records"
  ON library_downloads
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Library Integrations Policies
CREATE POLICY "Users can manage their own integrations"
  ON library_integrations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX library_content_type_idx ON library_content(type);
CREATE INDEX library_content_category_idx ON library_content(category);
CREATE INDEX library_content_tags_idx ON library_content USING gin(tags);
CREATE INDEX library_downloads_user_id_idx ON library_downloads(user_id);
CREATE INDEX library_integrations_user_id_idx ON library_integrations(user_id);

-- Update timestamps trigger
CREATE TRIGGER update_library_content_updated_at
  BEFORE UPDATE ON library_content
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_library_integrations_updated_at
  BEFORE UPDATE ON library_integrations
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Add audit logging
CREATE TRIGGER audit_library_content
  AFTER INSERT OR UPDATE OR DELETE ON library_content
  FOR EACH ROW EXECUTE PROCEDURE create_audit_log();

CREATE TRIGGER audit_library_integrations
  AFTER INSERT OR UPDATE OR DELETE ON library_integrations
  FOR EACH ROW EXECUTE PROCEDURE create_audit_log();