/*
  # Create Admin Password Verification Function

  1. Functions
    - `verify_admin_password` - Function to verify admin password using crypt
*/

-- Create function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(admin_email text, password_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash text;
BEGIN
  -- Get the stored password hash for the admin user
  SELECT password_hash INTO stored_hash
  FROM admin_users
  WHERE email = admin_email;
  
  -- If no admin user found, return false
  IF stored_hash IS NULL THEN
    RETURN false;
  END IF;
  
  -- Verify the password using crypt
  RETURN stored_hash = crypt(password_input, stored_hash);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION verify_admin_password(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_admin_password(text, text) TO anon;