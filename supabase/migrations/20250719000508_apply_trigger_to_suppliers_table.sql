-- Create updated_at trigger
CREATE TRIGGER update_suppliers_updated_at 
    BEFORE UPDATE ON suppliers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
