-- Create updated_at trigger
CREATE TRIGGER update_product_variations_updated_at 
    BEFORE UPDATE ON product_variations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update product quantity
CREATE TRIGGER update_product_quantity_trigger
    AFTER INSERT OR UPDATE OR DELETE ON product_variations
    FOR EACH ROW
    EXECUTE FUNCTION update_product_quantity();
