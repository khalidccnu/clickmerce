-- Create updated_at trigger
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
