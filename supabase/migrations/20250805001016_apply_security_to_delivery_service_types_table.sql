-- Apply dynamic security to delivery_service_types table
-- This will complete the permission and RLS setup for delivery_service_types table

SELECT setup_table_security('Delivery Management', 'delivery_service_types', null, null, ARRAY['pos', 'delivery_zones', 'orders', 'order_returns', 'order_payment_requests']);

-- Create policy for public read access
CREATE POLICY "Public can read all delivery_service_types"
  ON delivery_service_types
  FOR SELECT
  TO public
  USING (true);
