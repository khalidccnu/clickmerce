-- Apply dynamic security to payment_methods table
-- This will complete the permission and RLS setup for payment_methods table

SELECT setup_table_security('Basic Management', 'payment_methods');
