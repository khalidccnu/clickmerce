-- Apply dynamic security to settings table
-- This will complete the permission and RLS setup for settings table

SELECT setup_table_security('Basic Management', 'settings', null, null, ARRAY['pos']);

-- Create a view for public read access
CREATE OR REPLACE VIEW settings_view AS
SELECT id, created_at, updated_at, identity, vat, tax, tracking_codes, is_active
FROM settings;
