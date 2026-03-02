/*
  # Add email field to quote requests

  1. Changes
    - Add optional `email` column to `quote_requests` table
    - Email is text type and nullable (optional field)
  
  2. Notes
    - Email allows customers to provide contact preference
    - Existing records will have NULL for email field
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quote_requests' AND column_name = 'email'
  ) THEN
    ALTER TABLE quote_requests ADD COLUMN email text;
  END IF;
END $$;

