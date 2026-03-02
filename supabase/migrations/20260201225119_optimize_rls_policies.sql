/*
  # Optimize RLS Policies for Performance and Security
  
  1. Performance Optimization
    - Optimize admin policies on `installers` table by using `(select auth.jwt())` 
    - This prevents re-evaluation of auth functions for each row, improving query performance
    
  2. Security Hardening for Quote Requests
    - Replace overly permissive `WITH CHECK (true)` policy
    - Add validation to ensure submitted data meets basic requirements:
      - Name must be at least 2 characters and not just whitespace
      - Phone must be at least 10 characters (basic validation)
      - All required fields must be present and non-empty
      
  3. Important Notes
    - Auth DB Connection Strategy warning must be fixed in Supabase dashboard Settings > Database
    - The optimized policies maintain the same access control but with better performance
*/

-- Drop existing admin policies to recreate with optimizations
DROP POLICY IF EXISTS "Admin users can insert installers" ON installers;
DROP POLICY IF EXISTS "Admin users can update installers" ON installers;
DROP POLICY IF EXISTS "Admin users can delete installers" ON installers;

-- Recreate admin policies with performance optimization
CREATE POLICY "Admin users can insert installers"
  ON installers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    ((select auth.jwt())->>'role' = 'authenticated') AND
    (((select auth.jwt())->'app_metadata'->>'is_admin')::boolean = true)
  );

CREATE POLICY "Admin users can update installers"
  ON installers
  FOR UPDATE
  TO authenticated
  USING (
    ((select auth.jwt())->>'role' = 'authenticated') AND
    (((select auth.jwt())->'app_metadata'->>'is_admin')::boolean = true)
  )
  WITH CHECK (
    ((select auth.jwt())->>'role' = 'authenticated') AND
    (((select auth.jwt())->'app_metadata'->>'is_admin')::boolean = true)
  );

CREATE POLICY "Admin users can delete installers"
  ON installers
  FOR DELETE
  TO authenticated
  USING (
    ((select auth.jwt())->>'role' = 'authenticated') AND
    (((select auth.jwt())->'app_metadata'->>'is_admin')::boolean = true)
  );

-- Drop and recreate quote requests policy with proper validation
DROP POLICY IF EXISTS "Anyone can submit quote requests" ON quote_requests;

CREATE POLICY "Anonymous users can submit valid quote requests"
  ON quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Ensure name is provided and has reasonable length
    name IS NOT NULL AND
    length(trim(name)) >= 2 AND
    length(name) <= 200 AND
    -- Ensure address is provided
    address IS NOT NULL AND
    length(trim(address)) >= 5 AND
    length(address) <= 500 AND
    -- Ensure phone is provided with basic length validation
    phone IS NOT NULL AND
    length(trim(phone)) >= 10 AND
    length(phone) <= 50 AND
    -- Ensure email_sent is false or null (user cannot set this to true)
    (email_sent = false OR email_sent IS NULL)
  );

