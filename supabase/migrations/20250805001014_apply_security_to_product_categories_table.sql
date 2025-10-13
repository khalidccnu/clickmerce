-- Apply dynamic security to product_categories table
-- This will complete the permission and RLS setup for product_categories table

SELECT setup_table_security('Inventory Management', 'product_categories', 'product_id', 'products');
