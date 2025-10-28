-- Create updated_at trigger
CREATE TRIGGER update_banners_updated_at
    BEFORE UPDATE ON banners 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
