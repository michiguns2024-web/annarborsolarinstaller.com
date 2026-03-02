/*
  # Fix Security Issues
  
  1. Index Optimization
    - Drop unused `idx_installers_name` index that is not being utilized
    
  2. RLS Policy Security Hardening
    - Drop overly permissive policies on `installers` table that allowed any authenticated user full write access
    - Implement proper admin-only access control using Supabase auth metadata
    - Keep public read access for installers (directory is meant to be publicly viewable)
    
  3. Admin Role Implementation
    - Add policies that check for admin role in user metadata
    - Only users with `is_admin: true` in their `raw_app_meta_data` can modify installers
    
  4. Quote Requests Table
    - Keep anonymous INSERT access (this is intentional for public form submissions)
    - No changes needed - the policy is appropriate for the use case
    
  5. Important Notes
    - To create an admin user, set `raw_app_meta_data` with `{"is_admin": true}` in the Supabase dashboard
    - The Auth DB Connection Strategy warning must be fixed in the Supabase dashboard (not via migration)
*/

-- Drop the unused index
DROP INDEX IF EXISTS idx_installers_name;

-- Drop the overly permissive policies on installers table
DROP POLICY IF EXISTS "Authenticated users can insert installers" ON installers;
DROP POLICY IF EXISTS "Authenticated users can update installers" ON installers;
DROP POLICY IF EXISTS "Authenticated users can delete installers" ON installers;

-- Create secure admin-only policies for installers table
CREATE POLICY "Admin users can insert installers"
  ON installers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt()->>'role' = 'authenticated') AND
    ((auth.jwt()->'app_metadata'->>'is_admin')::boolean = true)
  );

CREATE POLICY "Admin users can update installers"
  ON installers
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'role' = 'authenticated') AND
    ((auth.jwt()->'app_metadata'->>'is_admin')::boolean = true)
  )
  WITH CHECK (
    (auth.jwt()->>'role' = 'authenticated') AND
    ((auth.jwt()->'app_metadata'->>'is_admin')::boolean = true)
  );

CREATE POLICY "Admin users can delete installers"
  ON installers
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt()->>'role' = 'authenticated') AND
    ((auth.jwt()->'app_metadata'->>'is_admin')::boolean = true)
  );

