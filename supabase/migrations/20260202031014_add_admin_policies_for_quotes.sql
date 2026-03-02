/*
  # Add Admin Policies for Quote Requests
  
  1. New Policies
    - Add SELECT policy to allow admins to view all quote requests
    - Add DELETE policy to allow admins to delete quote requests
    
  2. Security
    - Both policies check for authenticated user with admin role
    - Uses app_metadata to verify admin status
    
  3. Changes Summary
    - Admins can now view all quote requests submitted by customers
    - Admins can delete quote requests they've processed
*/

-- Allow admins to view all quote requests
CREATE POLICY "Admin users can view quote requests"
  ON quote_requests
  FOR SELECT
  TO authenticated
  USING (
    ((select auth.jwt())->>'role' = 'authenticated') AND
    (((select auth.jwt())->'app_metadata'->>'is_admin')::boolean = true)
  );

-- Allow admins to delete quote requests
CREATE POLICY "Admin users can delete quote requests"
  ON quote_requests
  FOR DELETE
  TO authenticated
  USING (
    ((select auth.jwt())->>'role' = 'authenticated') AND
    (((select auth.jwt())->'app_metadata'->>'is_admin')::boolean = true)
  );

