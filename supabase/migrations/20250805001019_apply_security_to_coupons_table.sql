-- Apply dynamic security to coupons table
-- This will complete the permission and RLS setup for coupons table

SELECT setup_table_security('Basic Management', 'coupons', null, null, ARRAY['pos']);
