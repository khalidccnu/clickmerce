-- Apply dynamic security to product_categories table
-- This will complete the permission and RLS setup for product_categories table

SELECT setup_table_security('Inventory Management', 'product_categories', 'product_id', 'products', ARRAY['pos', 'orders', 'order_returns']);

-- Create policy for public read access
CREATE POLICY "Public can read all product_categories"
  ON product_categories
  FOR SELECT
  TO public
  USING (true);
