-- Create updated_at trigger
CREATE TRIGGER update_order_payment_requests_updated_at
    BEFORE UPDATE ON order_payment_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
