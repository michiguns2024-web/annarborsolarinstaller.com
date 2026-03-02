/*
  # Solar Panel Installers Directory Schema

  1. New Tables
    - `installers`
      - `id` (uuid, primary key) - Unique identifier for each installer
      - `name` (text) - Company name
      - `description` (text) - Detailed description of services
      - `phone` (text) - Contact phone number
      - `email` (text) - Contact email address
      - `website` (text) - Company website URL
      - `address` (text) - Physical address
      - `rating` (numeric) - Average rating out of 5
      - `years_in_business` (integer) - How many years they've been operating
      - `certifications` (text array) - List of certifications
      - `services` (text array) - List of services offered
      - `price_range` (text) - Price indicator ($, $$, $$$)
      - `image_url` (text) - Logo or company image URL
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `installers` table
    - Add policy for public read access (directory is publicly viewable)
    - Add policy for authenticated users to insert/update (for admin functionality)
*/

CREATE TABLE IF NOT EXISTS installers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  website text,
  address text NOT NULL,
  rating numeric(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  years_in_business integer DEFAULT 0,
  certifications text[] DEFAULT '{}',
  services text[] DEFAULT '{}',
  price_range text DEFAULT '$$' CHECK (price_range IN ('$', '$$', '$$$')),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE installers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view installers"
  ON installers
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert installers"
  ON installers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update installers"
  ON installers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete installers"
  ON installers
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_installers_rating ON installers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_installers_name ON installers(name);

