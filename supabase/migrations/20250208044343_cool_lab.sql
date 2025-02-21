/*
  # Add Gamification Tables

  1. New Tables
    - user_points (track user points and levels)
    - user_streaks (track user activity streaks)
    - daily_goals (track daily activity goals)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
    - Add indexes for performance

  3. Functions
    - Add streak update function
    - Add achievement check function
*/

-- Add user_points table
CREATE TABLE IF NOT EXISTS user_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  points integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add user_streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  UNIQUE(user_id)
);

-- Add daily_goals table
CREATE TABLE IF NOT EXISTS daily_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  tokens_used integer NOT NULL DEFAULT 0,
  projects_created integer NOT NULL DEFAULT 0,
  reports_generated integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
  -- User Points Policies
  CREATE POLICY "Users can read their own points"
    ON user_points
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "System can update user points"
    ON user_points
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

  -- User Streaks Policies
  CREATE POLICY "Users can read their own streaks"
    ON user_streaks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "System can update user streaks"
    ON user_streaks
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

  -- Daily Goals Policies
  CREATE POLICY "Users can read their own daily goals"
    ON daily_goals
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "System can update daily goals"
    ON daily_goals
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS user_points_user_id_idx ON user_points(user_id);
CREATE INDEX IF NOT EXISTS user_streaks_user_id_idx ON user_streaks(user_id);
CREATE INDEX IF NOT EXISTS daily_goals_user_id_date_idx ON daily_goals(user_id, date);

-- Create function to update streaks
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate days since last activity
  IF NEW.last_activity_date - OLD.last_activity_date = 1 THEN
    -- Increment streak for consecutive days
    NEW.current_streak := OLD.current_streak + 1;
    -- Update longest streak if current is higher
    IF NEW.current_streak > OLD.longest_streak THEN
      NEW.longest_streak := NEW.current_streak;
    END IF;
  ELSE
    -- Reset streak for non-consecutive days
    NEW.current_streak := 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for streak updates
DROP TRIGGER IF EXISTS update_streak_trigger ON user_streaks;
CREATE TRIGGER update_streak_trigger
  BEFORE UPDATE ON user_streaks
  FOR EACH ROW
  WHEN (NEW.last_activity_date IS DISTINCT FROM OLD.last_activity_date)
  EXECUTE FUNCTION update_user_streak();

-- Create function to check achievements
CREATE OR REPLACE FUNCTION check_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- Check streak achievement
  IF NEW.current_streak >= 7 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (NEW.user_id, 'streak-warrior')
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for achievement checks
DROP TRIGGER IF EXISTS check_achievements_trigger ON user_streaks;
CREATE TRIGGER check_achievements_trigger
  AFTER UPDATE ON user_streaks
  FOR EACH ROW
  EXECUTE FUNCTION check_achievements();

-- Add audit logging
DROP TRIGGER IF EXISTS audit_user_points ON user_points;
CREATE TRIGGER audit_user_points
  AFTER INSERT OR UPDATE OR DELETE ON user_points
  FOR EACH ROW EXECUTE PROCEDURE create_audit_log();

DROP TRIGGER IF EXISTS audit_user_streaks ON user_streaks;
CREATE TRIGGER audit_user_streaks
  AFTER INSERT OR UPDATE OR DELETE ON user_streaks
  FOR EACH ROW EXECUTE PROCEDURE create_audit_log();