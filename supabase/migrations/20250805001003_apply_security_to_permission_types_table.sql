-- Apply dynamic security to permission_types table
-- This will complete the permission and RLS setup for permission_types table

SELECT setup_table_security('Role Management', 'permission_types');
