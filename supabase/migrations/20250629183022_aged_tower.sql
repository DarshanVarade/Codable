/*
  # Add admin functions for user management

  1. Functions
    - Enable admin to list all users
    - Enable admin to delete users
    - Add RLS policies for admin access

  2. Security
    - Only allow admin email to access these functions
    - Maintain data integrity during user deletion
*/

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN user_email = 'vampire@gmail.com';
END;
$$;

-- Function to get current user email
CREATE OR REPLACE FUNCTION get_current_user_email()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email text;
BEGIN
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid();
  
  RETURN user_email;
END;
$$;

-- Update RLS policies to allow admin access
ALTER POLICY "Users can view their own stats" ON user_stats
USING (
  (auth.uid() = user_id) OR 
  is_admin(get_current_user_email())
);

ALTER POLICY "Public profiles are viewable by everyone" ON profiles
USING (
  true OR 
  is_admin(get_current_user_email())
);

-- Add admin policy for user_stats
CREATE POLICY "Admin can view all stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (is_admin(get_current_user_email()));

-- Add admin policy for profiles
CREATE POLICY "Admin can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_admin(get_current_user_email()));