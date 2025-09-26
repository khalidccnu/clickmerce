-- Create updated_at trigger
CREATE TRIGGER update_generics_updated_at 
    BEFORE UPDATE ON generics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
