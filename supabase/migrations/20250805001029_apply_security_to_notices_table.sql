-- Apply dynamic security to notices table
-- This will complete the permission and RLS setup for notices table

SELECT setup_table_security('Content Management', 'notices');

-- Create policy for public read access
CREATE POLICY "Public can read all notices"
  ON notices
  FOR SELECT
  TO public
  USING (true);
