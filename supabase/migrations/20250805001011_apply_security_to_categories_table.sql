-- Apply dynamic security to categories table
-- This will complete the permission and RLS setup for categories table

SELECT setup_table_security('Inventory Management', 'categories');
