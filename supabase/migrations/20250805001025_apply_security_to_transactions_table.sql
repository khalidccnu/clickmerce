-- Apply dynamic security to transactions table
-- This will complete the permission and RLS setup for transactions table

SELECT setup_table_security('Basic Management', 'transactions', null, null, ARRAY['pos', 'orders', 'order_returns', 'order_payment_requests']);
SELECT create_permission_dependency_policy(
    ARRAY['pos', 'order_returns'],
    'transactions',
    ARRAY['write']
);
SELECT create_permission_mapping('orders:update', 'transactions:write');
SELECT create_permission_mapping('order_payment_requests:update', 'transactions:write');
