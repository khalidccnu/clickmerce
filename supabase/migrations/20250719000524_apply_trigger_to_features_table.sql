-- Create updated_at trigger
CREATE TRIGGER update_features_updated_at
    BEFORE UPDATE ON features 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
