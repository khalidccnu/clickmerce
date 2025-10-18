-- Apply dynamic security to settings table
-- This will complete the permission and RLS setup for settings table

SELECT setup_table_security('Basic Management', 'settings', null, null, ARRAY['pos']);
