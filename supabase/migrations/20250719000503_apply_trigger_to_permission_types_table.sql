-- Create updated_at trigger
CREATE TRIGGER update_permission_types_updated_at 
    BEFORE UPDATE ON permission_types 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
