/*
  # Remove address field from installers table

  1. Changes
    - Drop the `address` column from the `installers` table
    
  2. Notes
    - This is a destructive operation that will remove all address data
    - Existing data in the address column will be permanently deleted
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'installers' AND column_name = 'address'
  ) THEN
    ALTER TABLE installers DROP COLUMN address;
  END IF;
END $$;

