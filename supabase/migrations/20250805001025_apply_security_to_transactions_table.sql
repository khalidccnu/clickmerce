-- Apply dynamic security to transactions table
-- This will complete the permission and RLS setup for transactions table

SELECT setup_table_security('Basic Management', 'transactions', null, null, ARRAY['pos', 'orders', 'order_returns']);
SELECT create_permission_dependency_policy(
    ARRAY['pos', 'order_returns'],
    'transactions',
    ARRAY['write']
);
SELECT create_permission_mapping('orders:update', 'transactions:write');
