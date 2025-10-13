-- Create updated_at trigger
CREATE TRIGGER update_order_returns_updated_at 
    BEFORE UPDATE ON order_returns 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
