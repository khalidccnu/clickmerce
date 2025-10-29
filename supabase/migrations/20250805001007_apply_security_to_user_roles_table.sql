-- Apply dynamic security to user_roles table
-- This will complete the permission and RLS setup for user_roles table

SELECT setup_table_security('User Management', 'user_roles', 'user_id', 'users', ARRAY['pos', 'orders', 'order_returns', 'transactions']);
