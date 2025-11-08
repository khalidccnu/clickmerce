-- Create updated_at trigger
CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON pages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
