/*
  # Achievements and Progress System

  1. New Tables
    - `achievements`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `criteria` (jsonb)
      - `points` (integer)
      - `created_at` (timestamp)
    
    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `achievement_id` (uuid, references achievements)
      - `unlocked_at` (timestamp)
      - `progress` (jsonb)

    - `user_stats`
      - `user_id` (uuid, references profiles, primary key)
      - `total_analyses` (integer)
      - `problems_solved` (integer)
      - `current_streak` (integer)
      - `longest_streak` (integer)
      - `time_saved_minutes` (integer)
      - `total_points` (integer)
      - `last_activity` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT 'award',
  criteria jsonb DEFAULT '{}',
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  progress jsonb DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_analyses integer DEFAULT 0,
  problems_solved integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  time_saved_minutes integer DEFAULT 0,
  total_points integer DEFAULT 0,
  last_activity timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policies for achievements (public read)
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements
  FOR SELECT
  USING (true);

-- Policies for user_achievements
CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON user_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_stats
CREATE POLICY "Users can view their own stats"
  ON user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON user_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON user_stats
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger for updating user_stats updated_at
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to initialize user stats
CREATE OR REPLACE FUNCTION initialize_user_stats()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to initialize stats when profile is created
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE PROCEDURE initialize_user_stats();

-- Insert default achievements
INSERT INTO achievements (name, description, icon, criteria, points) VALUES
  ('First Analysis', 'Complete your first code analysis', 'code', '{"analyses_count": 1}', 10),
  ('Problem Solver', 'Solve 10 programming problems', 'help-circle', '{"problems_solved": 10}', 50),
  ('Speed Demon', 'Analyze code in under 10 seconds', 'zap', '{"fast_analysis": true}', 25),
  ('Debugging Master', 'Find and fix 5 bugs', 'bug', '{"bugs_fixed": 5}', 75),
  ('Streak Master', 'Maintain a 7-day coding streak', 'calendar', '{"streak_days": 7}', 100),
  ('Code Explorer', 'Try 5 different programming languages', 'globe', '{"languages_used": 5}', 30)
ON CONFLICT DO NOTHING;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);