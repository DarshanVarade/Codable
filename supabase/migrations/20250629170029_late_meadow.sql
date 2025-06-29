/*
  # Code Analysis System

  1. New Tables
    - `code_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `code_content` (text)
      - `language` (text)
      - `analysis_result` (jsonb)
      - `score` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `code_analyses` table
    - Add policies for users to manage their own analyses
*/

-- Create code_analyses table
CREATE TABLE IF NOT EXISTS code_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Analysis',
  code_content text NOT NULL,
  language text NOT NULL DEFAULT 'javascript',
  analysis_result jsonb DEFAULT '{}',
  score integer DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE code_analyses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own analyses"
  ON code_analyses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON code_analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
  ON code_analyses
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
  ON code_analyses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updating updated_at
CREATE TRIGGER update_code_analyses_updated_at
  BEFORE UPDATE ON code_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_code_analyses_user_id ON code_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_code_analyses_created_at ON code_analyses(created_at DESC);