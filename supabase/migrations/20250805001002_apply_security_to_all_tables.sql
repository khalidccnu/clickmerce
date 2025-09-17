-- Apply dynamic security to all existing core tables
-- This will complete the permission and RLS setup for all tables

-- Apply security to users table (admin-only access)
SELECT setup_table_security('User Management', 'users');

-- Apply security to users_info table (with user ownership, inherits users:* permissions)
SELECT setup_table_security('User Management', 'users_info', 'user_id', 'users');

-- Apply security to permission_types table (admin-only access)
SELECT setup_table_security('Role Management', 'permission_types');

-- Apply security to permissions table (admin-only access)
SELECT setup_table_security('Role Management', 'permissions');

-- Apply security to roles table (admin-only access)
SELECT setup_table_security('Role Management', 'roles');

-- Apply security to role_permissions table (admin-only access, inherits roles:* permissions)
SELECT setup_table_security('Role Management', 'role_permissions', null, 'roles');

-- Apply security to user_roles table (with user ownership, inherits users:* permissions)
SELECT setup_table_security('User Management', 'user_roles', 'user_id', 'users');

-- Apply security to suppliers table (admin-only access)
SELECT setup_table_security('Inventory Management', 'suppliers');
