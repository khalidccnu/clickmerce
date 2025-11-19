-- Apply dynamic security to payment_methods table
-- This will complete the permission and RLS setup for payment_methods table

SELECT setup_table_security('Basic Management', 'payment_methods', null, null, ARRAY['pos', 'orders', 'order_returns']);

-- Create policy for public read access
CREATE POLICY "Public can read all payment_methods"
  ON payment_methods
  FOR SELECT
  TO public
  USING (true);
