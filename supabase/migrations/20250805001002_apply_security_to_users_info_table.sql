-- Apply dynamic security to users_info table
-- This will complete the permission and RLS setup for users_info table

SELECT setup_table_security('User Management', 'users_info', 'user_id', 'users', ARRAY['pos', 'orders', 'order_returns']);
