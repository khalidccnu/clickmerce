-- Apply dynamic security to orders table
-- This will complete the permission and RLS setup for orders table

SELECT setup_table_security('Sale Management', 'orders');
