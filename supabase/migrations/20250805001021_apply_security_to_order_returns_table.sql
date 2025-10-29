-- Apply dynamic security to order_returns table
-- This will complete the permission and RLS setup for order_returns table

SELECT setup_table_security('Sale Management', 'order_returns');
SELECT create_permission_mapping('order_returns:write', 'order_returns:read');
