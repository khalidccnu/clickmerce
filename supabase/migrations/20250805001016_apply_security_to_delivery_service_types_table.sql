-- Apply dynamic security to delivery_service_types table
-- This will complete the permission and RLS setup for delivery_service_types table

SELECT setup_table_security('Delivery Management', 'delivery_service_types', null, null, ARRAY['pos', 'delivery_zones', 'orders', 'order_returns']);
