-- Apply dynamic security to order_payment_requests table
-- This will complete the permission and RLS setup for order_payment_requests table

SELECT setup_table_security('Sale Management', 'order_payment_requests');
