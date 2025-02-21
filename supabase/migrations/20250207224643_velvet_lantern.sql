/*
  # Project Management and Collaboration Schema

  1. New Tables
    - `projects`
      - Project metadata and settings
      - Versioning support
      - Collaboration settings
    - `project_versions`
      - Version history for projects
    - `project_collaborators`
      - User collaboration mappings
    - `project_templates`
      - Reusable project templates
  
  2. Security
    - Enable RLS on all tables
    - Add policies for collaboration
*/

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid REFERENCES auth.users(id) NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  is_template boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project Versions Table
CREATE TABLE IF NOT EXISTS project_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  content jsonb NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, version_number)
);

-- Project Collaborators Table
CREATE TABLE IF NOT EXISTS project_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('viewer', 'editor', 'admin')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Project Templates Table
CREATE TABLE IF NOT EXISTS project_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  content jsonb NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;

-- Project Policies
CREATE POLICY "Users can read their own and collaborated projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM project_collaborators
      WHERE project_id = projects.id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners and admins can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM project_collaborators
      WHERE project_id = projects.id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Version Policies
CREATE POLICY "Users can read versions of accessible projects"
  ON project_versions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      LEFT JOIN project_collaborators pc ON pc.project_id = p.id
      WHERE p.id = project_versions.project_id
      AND (p.owner_id = auth.uid() OR pc.user_id = auth.uid())
    )
  );

CREATE POLICY "Editors and admins can create versions"
  ON project_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      LEFT JOIN project_collaborators pc ON pc.project_id = p.id
      WHERE p.id = project_versions.project_id
      AND (
        p.owner_id = auth.uid() OR
        (pc.user_id = auth.uid() AND pc.role IN ('editor', 'admin'))
      )
    )
  );

-- Collaborator Policies
CREATE POLICY "Users can view collaborators of their projects"
  ON project_collaborators
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_collaborators.project_id
      AND (owner_id = auth.uid() OR project_collaborators.user_id = auth.uid())
    )
  );

CREATE POLICY "Project owners can manage collaborators"
  ON project_collaborators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_collaborators.project_id
      AND owner_id = auth.uid()
    )
  );

-- Template Policies
CREATE POLICY "Users can read public templates"
  ON project_templates
  FOR SELECT
  TO authenticated
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create templates"
  ON project_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Create indexes
CREATE INDEX projects_owner_id_idx ON projects(owner_id);
CREATE INDEX project_versions_project_id_idx ON project_versions(project_id);
CREATE INDEX project_collaborators_project_id_user_id_idx ON project_collaborators(project_id, user_id);
CREATE INDEX project_templates_category_idx ON project_templates(category);

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_project_templates_updated_at
  BEFORE UPDATE ON project_templates
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();