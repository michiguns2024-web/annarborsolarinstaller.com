/*
  # Create quote_requests table

  1. New Tables
    - `quote_requests`
      - `id` (uuid, primary key) - Unique identifier for each quote request
      - `name` (text) - Customer's full name
      - `address` (text) - Customer's address
      - `phone` (text) - Customer's phone number
      - `email_sent` (boolean) - Whether the email notification was sent
      - `created_at` (timestamptz) - When the request was submitted
      
  2. Security
    - Enable RLS on `quote_requests` table
    - Add policy for anonymous users to insert their own quote requests
    - Add policy for authenticated users (admins) to view all quote requests
    
  3. Notes
    - Allows visitors to submit quote requests without authentication
    - Tracks email sending status for reliability
*/

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit quote requests"
  ON quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all quote requests"
  ON quote_requests
  FOR SELECT
  TO authenticated
  USING (true);


