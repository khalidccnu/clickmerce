-- Apply dynamic security to role_permissions table
-- This will complete the permission and RLS setup for role_permissions table

SELECT setup_table_security('Role Management', 'role_permissions', null, 'roles');
