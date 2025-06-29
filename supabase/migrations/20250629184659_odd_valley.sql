/*
  # Admin Panel Functions

  1. New Functions
    - `get_all_users_for_admin_panel` - Securely fetch all users with profiles and stats for admin panel
    - `delete_user_admin` - Securely delete a user and all associated data
    - `is_admin` - Check if current user is an admin
    - `get_current_user_email` - Get current user's email

  2. Security
    - Functions use security definer to run with elevated privileges
    - Admin check ensures only authorized users can access these functions
    - Proper error handling and validation
*/

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  check_email text;
BEGIN
  -- Use provided email or get current user's email
  IF user_email IS NULL THEN
    SELECT auth.jwt() ->> 'email' INTO check_email;
  ELSE
    check_email := user_email;
  END IF;
  
  -- Check if email exists in admin_users table
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = check_email
  );
END;
$$;

-- Function to get current user's email
CREATE OR REPLACE FUNCTION get_current_user_email()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN auth.jwt() ->> 'email';
END;
$$;

-- Function to get all users for admin panel
CREATE OR REPLACE FUNCTION get_all_users_for_admin_panel()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  email_confirmed_at timestamptz,
  last_sign_in_at timestamptz,
  full_name text,
  username text,
  avatar_url text,
  profile_created_at timestamptz,
  total_analyses integer,
  problems_solved integer,
  current_streak integer,
  last_activity timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    au.id,
    au.email::text,
    au.created_at,
    au.email_confirmed_at,
    au.last_sign_in_at,
    p.full_name,
    p.username,
    p.avatar_url,
    p.created_at as profile_created_at,
    COALESCE(us.total_analyses, 0) as total_analyses,
    COALESCE(us.problems_solved, 0) as problems_solved,
    COALESCE(us.current_streak, 0) as current_streak,
    us.last_activity
  FROM auth.users au
  LEFT JOIN profiles p ON au.id = p.id
  LEFT JOIN user_stats us ON au.id = us.user_id
  ORDER BY au.created_at DESC;
END;
$$;

-- Function to delete user (admin only)
CREATE OR REPLACE FUNCTION delete_user_admin(user_id_to_delete uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Delete from auth.users (this will cascade to profiles and other tables)
  DELETE FROM auth.users WHERE id = user_id_to_delete;
  
  -- Return true if deletion was successful
  RETURN FOUND;
END;
$$;

-- Function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(admin_email text, password_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash text;
BEGIN
  -- Get the stored password hash
  SELECT password_hash INTO stored_hash
  FROM admin_users
  WHERE email = admin_email;
  
  -- If no admin found, return false
  IF stored_hash IS NULL THEN
    RETURN false;
  END IF;
  
  -- Verify password using crypt function
  RETURN crypt(password_input, stored_hash) = stored_hash;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_all_users_for_admin_panel() TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_email() TO authenticated;
GRANT EXECUTE ON FUNCTION verify_admin_password(text, text) TO authenticated;

-- Also grant to public for RLS policies
GRANT EXECUTE ON FUNCTION is_admin(text) TO public;
GRANT EXECUTE ON FUNCTION get_current_user_email() TO public;