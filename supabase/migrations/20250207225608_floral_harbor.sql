/*
  # Analytics and Notifications Schema

  1. New Tables
    - `analytics_events`
      - Track user actions and system events
    - `notifications`
      - User notifications and alerts
    - `notification_preferences`
      - Per-user notification settings
    - `api_keys`
      - User API keys for external integrations
    - `audit_logs`
      - System-wide audit trail
  
  2. Security
    - Enable RLS on all tables
    - Add policies for data protection
*/

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  event_type text NOT NULL,
  event_data jsonb NOT NULL,
  session_id uuid,
  client_info jsonb,
  created_at timestamptz DEFAULT now()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  channel text NOT NULL,
  type text NOT NULL,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, channel, type)
);

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  key_hash text NOT NULL,
  permissions jsonb DEFAULT '{}'::jsonb,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  changes jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Analytics Events Policies
CREATE POLICY "Users can insert their own events"
  ON analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can read their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notification Preferences Policies
CREATE POLICY "Users can manage their notification preferences"
  ON notification_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- API Keys Policies
CREATE POLICY "Users can manage their API keys"
  ON api_keys
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Audit Logs Policies
CREATE POLICY "Users can read their own audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX analytics_events_user_id_type_idx ON analytics_events(user_id, event_type);
CREATE INDEX analytics_events_created_at_idx ON analytics_events(created_at);
CREATE INDEX notifications_user_id_created_at_idx ON notifications(user_id, created_at);
CREATE INDEX api_keys_user_id_idx ON api_keys(user_id);
CREATE INDEX audit_logs_user_id_created_at_idx ON audit_logs(user_id, created_at);
CREATE INDEX audit_logs_resource_idx ON audit_logs(resource_type, resource_id);

-- Update timestamps triggers
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Function to create audit log
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    changes,
    metadata
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ),
    jsonb_build_object(
      'timestamp', CURRENT_TIMESTAMP,
      'operation', TG_OP
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers to key tables
CREATE TRIGGER audit_projects
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE PROCEDURE create_audit_log();

CREATE TRIGGER audit_api_keys
  AFTER INSERT OR UPDATE OR DELETE ON api_keys
  FOR EACH ROW EXECUTE PROCEDURE create_audit_log();