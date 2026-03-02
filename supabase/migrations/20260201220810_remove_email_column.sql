/*
  # Remove email column from installers table

  1. Changes
    - Remove `email` column from `installers` table
    - This column is no longer needed for the solar installer directory

  2. Notes
    - This is a safe operation as we're removing a column that's not critical
    - No data migration needed as we're simply dropping the column
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'installers' AND column_name = 'email'
  ) THEN
    ALTER TABLE installers DROP COLUMN email;
  END IF;
END $$;


