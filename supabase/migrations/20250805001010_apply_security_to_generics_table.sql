-- Apply dynamic security to generics table
-- This will complete the permission and RLS setup for generics table

SELECT setup_table_security('Inventory Management', 'generics', null, null, ARRAY['pos', 'products', 'orders', 'order_returns']);
