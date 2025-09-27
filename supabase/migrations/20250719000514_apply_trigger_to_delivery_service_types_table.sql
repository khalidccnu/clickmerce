-- Create updated_at trigger
CREATE TRIGGER update_delivery_service_types_updated_at 
    BEFORE UPDATE ON delivery_service_types 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
