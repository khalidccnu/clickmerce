-- Apply dynamic security to pages table
-- This will complete the permission and RLS setup for pages table

SELECT setup_table_security('Content Management', 'pages');

-- Create policy for public read access
CREATE POLICY "Public can read all pages"
  ON pages
  FOR SELECT
  TO public
  USING (true);
