-- Create updated_at trigger
CREATE TRIGGER update_dosage_forms_updated_at 
    BEFORE UPDATE ON dosage_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
