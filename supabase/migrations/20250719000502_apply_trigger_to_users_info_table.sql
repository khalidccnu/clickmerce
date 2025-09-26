CREATE TRIGGER update_users_info_updated_at 
    BEFORE UPDATE ON users_info 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
