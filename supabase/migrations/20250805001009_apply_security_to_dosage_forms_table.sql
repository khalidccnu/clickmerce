-- Apply dynamic security to dosage_forms table
-- This will complete the permission and RLS setup for dosage_forms table

SELECT setup_table_security('Inventory Management', 'dosage_forms', null, null, ARRAY['pos', 'products', 'orders', 'order_returns']);
