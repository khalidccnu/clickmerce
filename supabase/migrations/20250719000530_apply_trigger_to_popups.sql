-- Create updated_at trigger
CREATE TRIGGER update_popups_updated_at
    BEFORE UPDATE ON popups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
