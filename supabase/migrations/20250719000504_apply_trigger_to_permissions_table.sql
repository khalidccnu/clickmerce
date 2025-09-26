-- Create updated_at trigger
CREATE TRIGGER update_permissions_updated_at 
    BEFORE UPDATE ON permissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
