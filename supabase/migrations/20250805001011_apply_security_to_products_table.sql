-- Apply dynamic security to products table
-- This will complete the permission and RLS setup for products table

SELECT setup_table_security('Inventory Management', 'products');
