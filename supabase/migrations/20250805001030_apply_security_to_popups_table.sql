-- Apply dynamic security to popups table
-- This will complete the permission and RLS setup for popups table

SELECT setup_table_security('Content Management', 'popups');

-- Create policy for public read access
CREATE POLICY "Public can read all popups"
  ON popups
  FOR SELECT
  TO public
  USING (true);
