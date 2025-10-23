-- Create updated_at trigger
CREATE TRIGGER update_galleries_updated_at
    BEFORE UPDATE ON galleries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
