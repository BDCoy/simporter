/*
  # Gamification and User Preferences Schema

  1. New Tables
    - `achievements`
      - Achievement definitions and rewards
    - `user_achievements`
      - Track unlocked achievements per user
    - `user_streaks`
      - Daily activity tracking
    - `user_preferences`
      - User settings and preferences
  
  2. Security
    - Enable RLS on all tables
    - Add policies for user data protection
*/

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  category text NOT NULL,
  requirements jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  achievement_id uuid REFERENCES achievements(id) NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(user_id, achievement_id)
);

-- User Streaks Table
CREATE TABLE IF NOT EXISTS user_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  started_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  theme text DEFAULT 'light',
  language text DEFAULT 'en',
  notifications jsonb DEFAULT '{"email": true, "push": true}'::jsonb,
  custom_wallpaper text,
  ui_settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Achievement Policies
CREATE POLICY "Everyone can read achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (true);

-- User Achievement Policies
CREATE POLICY "Users can read their own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create user achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User Streaks Policies
CREATE POLICY "Users can read their own streaks"
  ON user_streaks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON user_streaks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- User Preferences Policies
CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX user_achievements_user_id_idx ON user_achievements(user_id);
CREATE INDEX user_streaks_user_id_idx ON user_streaks(user_id);
CREATE INDEX user_preferences_user_id_idx ON user_preferences(user_id);

-- Update timestamps trigger for user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Update timestamps trigger for user_streaks
CREATE TRIGGER update_user_streaks_updated_at
  BEFORE UPDATE ON user_streaks
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Function to update streaks
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  days_since_last integer;
BEGIN
  -- Calculate days since last activity
  days_since_last := EXTRACT(DAY FROM (NEW.last_activity_date - OLD.last_activity_date));
  
  -- If exactly one day has passed, increment streak
  IF days_since_last = 1 THEN
    NEW.current_streak := OLD.current_streak + 1;
    -- Update longest streak if current is higher
    IF NEW.current_streak > OLD.longest_streak THEN
      NEW.longest_streak := NEW.current_streak;
    END IF;
  -- If more than one day has passed, reset streak
  ELSIF days_since_last > 1 THEN
    NEW.current_streak := 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_streak
  BEFORE UPDATE ON user_streaks
  FOR EACH ROW
  WHEN (NEW.last_activity_date IS DISTINCT FROM OLD.last_activity_date)
  EXECUTE PROCEDURE update_user_streak();

-- Insert default achievements
INSERT INTO achievements (title, description, icon, points, category, requirements) VALUES
  ('First Project', 'Create your first project', '🚀', 100, 'projects', '{"type": "project_created", "count": 1}'::jsonb),
  ('Token Master', 'Use 100,000 tokens', '🎯', 200, 'usage', '{"type": "tokens_used", "count": 100000}'::jsonb),
  ('Team Player', 'Invite 3 team members', '👥', 150, 'collaboration', '{"type": "team_invites", "count": 3}'::jsonb),
  ('Data Explorer', 'Generate 10 reports', '📊', 300, 'analysis', '{"type": "reports_generated", "count": 10}'::jsonb),
  ('Streak Warrior', 'Maintain a 7-day activity streak', '🔥', 500, 'engagement', '{"type": "daily_streak", "days": 7}'::jsonb);