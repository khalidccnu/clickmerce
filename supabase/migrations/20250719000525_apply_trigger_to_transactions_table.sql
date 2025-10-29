-- Create updated_at trigger
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
