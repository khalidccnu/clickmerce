-- Apply dynamic security to users_info table
-- This will complete the permission and RLS setup for users_info table

SELECT setup_table_security('User Management', 'users_info', 'user_id', 'users', ARRAY['pos', 'orders', 'order_returns', 'order_payment_requests', 'transactions']);
SELECT create_permission_mapping('pos:write', 'users_info:update');
SELECT create_permission_mapping('orders:update', 'users_info:update');
SELECT create_permission_mapping('order_returns:write', 'users_info:update');
SELECT create_permission_mapping('order_payment_requests:update', 'users_info:update');
SELECT create_permission_mapping('transactions:write', 'users_info:update');
