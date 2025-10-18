-- Apply dynamic security to product_variations table
-- This will complete the permission and RLS setup for product_variations table

SELECT setup_table_security('Inventory Management', 'product_variations', 'product_id', 'products', ARRAY['pos', 'orders', 'order_returns']);
