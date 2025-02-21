/*
  # Reports and Integrations Schema

  1. New Tables
    - `reports`
      - Generated analysis reports
    - `report_versions`
      - Version history for reports
    - `report_shares`
      - Report sharing settings
    - `integrations`
      - Third-party service connections
    - `integration_tokens`
      - OAuth tokens for integrations
    - `scheduled_tasks`
      - Automated report generation
  
  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text,
  type text NOT NULL,
  parameters jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Report Versions Table
CREATE TABLE IF NOT EXISTS report_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  version integer NOT NULL,
  content jsonb NOT NULL,
  generated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(report_id, version)
);

-- Report Shares Table
CREATE TABLE IF NOT EXISTS report_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  shared_with uuid REFERENCES auth.users(id),
  permissions text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(report_id, shared_with)
);

-- Integrations Table
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  service text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active',
  last_sync_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, service)
);

-- Integration Tokens Table
CREATE TABLE IF NOT EXISTS integration_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid REFERENCES integrations(id) ON DELETE CASCADE,
  access_token text NOT NULL,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Scheduled Tasks Table
CREATE TABLE IF NOT EXISTS scheduled_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL,
  schedule text NOT NULL,
  parameters jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_run_at timestamptz,
  next_run_at timestamptz,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_tasks ENABLE ROW LEVEL SECURITY;

-- Reports Policies
CREATE POLICY "Users can read their own and shared reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    is_public = true OR
    EXISTS (
      SELECT 1 FROM report_shares
      WHERE report_id = reports.id
      AND shared_with = auth.uid()
    )
  );

CREATE POLICY "Users can create reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Report Versions Policies
CREATE POLICY "Users can read versions of accessible reports"
  ON report_versions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reports r
      LEFT JOIN report_shares rs ON rs.report_id = r.id
      WHERE r.id = report_versions.report_id
      AND (r.user_id = auth.uid() OR r.is_public OR rs.shared_with = auth.uid())
    )
  );

-- Report Shares Policies
CREATE POLICY "Users can manage shares of their reports"
  ON report_shares
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reports
      WHERE id = report_shares.report_id
      AND user_id = auth.uid()
    )
  );

-- Integrations Policies
CREATE POLICY "Users can manage their integrations"
  ON integrations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Integration Tokens Policies
CREATE POLICY "Users can manage their integration tokens"
  ON integration_tokens
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM integrations
      WHERE id = integration_tokens.integration_id
      AND user_id = auth.uid()
    )
  );

-- Scheduled Tasks Policies
CREATE POLICY "Users can manage their scheduled tasks"
  ON scheduled_tasks
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX reports_user_id_idx ON reports(user_id);
CREATE INDEX report_versions_report_id_idx ON report_versions(report_id);
CREATE INDEX report_shares_report_id_idx ON report_shares(report_id);
CREATE INDEX integrations_user_id_service_idx ON integrations(user_id, service);
CREATE INDEX scheduled_tasks_next_run_idx ON scheduled_tasks(next_run_at);

-- Update timestamps triggers
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_integration_tokens_updated_at
  BEFORE UPDATE ON integration_tokens
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_scheduled_tasks_updated_at
  BEFORE UPDATE ON scheduled_tasks
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Add audit triggers
CREATE TRIGGER audit_reports
  AFTER INSERT OR UPDATE OR DELETE ON reports
  FOR EACH ROW EXECUTE PROCEDURE create_audit_log();

CREATE TRIGGER audit_integrations
  AFTER INSERT OR UPDATE OR DELETE ON integrations
  FOR EACH ROW EXECUTE PROCEDURE create_audit_log();