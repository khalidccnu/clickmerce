-- Apply dynamic security to features table
-- This will complete the permission and RLS setup for features table

SELECT setup_table_security('Content Management', 'features');

-- Create policy for public read access
CREATE POLICY "Public can read all features"
  ON features
  FOR SELECT
  TO public
  USING (true);
