-- Apply dynamic security to permissions table
-- This will complete the permission and RLS setup for permissions table

SELECT setup_table_security('Role Management', 'permissions');
