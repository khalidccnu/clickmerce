-- Create updated_at trigger
CREATE TRIGGER update_delivery_zones_updated_at 
    BEFORE UPDATE ON delivery_zones 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
