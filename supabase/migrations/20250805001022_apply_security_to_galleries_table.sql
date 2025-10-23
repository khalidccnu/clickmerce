-- Apply dynamic security to galleries table
-- This will complete the permission and RLS setup for galleries table

SELECT setup_table_security('Basic Management', 'galleries');
