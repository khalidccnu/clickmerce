-- Apply dynamic security to orders table
-- This will complete the permission and RLS setup for orders table

SELECT setup_table_security('Sale Management', 'orders', null, null, ARRAY['pos', 'order_returns', 'order_payment_requests']);
SELECT create_permission_dependency_policy(
    ARRAY['pos'],
    'orders',
    ARRAY['write']
);
SELECT create_permission_dependency_policy(
    ARRAY['order_payment_requests'],
    'orders',
    ARRAY['update']
);
