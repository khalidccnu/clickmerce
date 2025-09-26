-- Apply dynamic security to users table
-- This will complete the permission and RLS setup for users table

SELECT setup_table_security('User Management', 'users');
