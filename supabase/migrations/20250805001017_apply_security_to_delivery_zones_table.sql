-- Apply dynamic security to delivery_zones table
-- This will complete the permission and RLS setup for delivery_zones table

SELECT setup_table_security('Delivery Management', 'delivery_zones', null, null, ARRAY['pos', 'orders', 'order_returns']);
