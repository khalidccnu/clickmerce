-- Apply dynamic security to order_payment_requests table
-- This will complete the permission and RLS setup for order_payment_requests table

SELECT setup_table_security('Sale Management', 'order_payment_requests');
SELECT create_permission_mapping('order_payment_requests:update', 'order_payment_requests:delete');
