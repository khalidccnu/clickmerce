-- Apply dynamic security to suppliers table
-- This will complete the permission and RLS setup for suppliers table

SELECT setup_table_security('Inventory Management', 'suppliers', null, null, ARRAY['pos', 'products', 'orders', 'order_returns']);
