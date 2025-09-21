-- Apply dynamic security to roles table
-- This will complete the permission and RLS setup for roles table

SELECT setup_table_security('Role Management', 'roles');
