-- Create updated_at trigger
CREATE TRIGGER update_notices_updated_at
    BEFORE UPDATE ON notices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
