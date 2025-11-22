-- Apply dynamic security to categories table
-- This will complete the permission and RLS setup for categories table

SELECT setup_table_security('Inventory Management', 'categories', null, null, ARRAY['pos', 'products', 'orders', 'order_returns']);

-- Create policy for public read access
CREATE POLICY "Public can read all categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);
