/*
  # Problem Solutions System

  1. New Tables
    - `problem_solutions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `problem_statement` (text)
      - `language` (text)
      - `solution_code` (text)
      - `explanation` (text)
      - `execution_result` (jsonb)
      - `optimization_suggestions` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `problem_solutions` table
    - Add policies for users to manage their own solutions
*/

-- Create problem_solutions table
CREATE TABLE IF NOT EXISTS problem_solutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  problem_statement text NOT NULL,
  language text NOT NULL DEFAULT 'javascript',
  solution_code text,
  explanation text,
  execution_result jsonb DEFAULT '{}',
  optimization_suggestions jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE problem_solutions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own solutions"
  ON problem_solutions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own solutions"
  ON problem_solutions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own solutions"
  ON problem_solutions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own solutions"
  ON problem_solutions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updating updated_at
CREATE TRIGGER update_problem_solutions_updated_at
  BEFORE UPDATE ON problem_solutions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_problem_solutions_user_id ON problem_solutions(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_solutions_created_at ON problem_solutions(created_at DESC);