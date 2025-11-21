-- Apply dynamic security to reviews table
-- This will complete the permission and RLS setup for reviews table

SELECT setup_table_security('Content Management', 'reviews');
