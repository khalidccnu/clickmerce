-- Apply dynamic security to banners table
-- This will complete the permission and RLS setup for banners table

SELECT setup_table_security('Content Management', 'banners');

-- Create policy for public read access
CREATE POLICY "Public can read all banners"
  ON banners
  FOR SELECT
  TO public
  USING (true);
