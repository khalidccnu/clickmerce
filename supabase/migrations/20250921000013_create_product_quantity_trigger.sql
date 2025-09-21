-- Create trigger function to automatically update product quantity
-- This function calculates the total quantity from all product variations
-- and updates the parent product's quantity field

CREATE OR REPLACE FUNCTION update_product_quantity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE products
        SET quantity = (
            SELECT COALESCE(SUM(quantity), 0) 
            FROM product_variations 
            WHERE product_id = NEW.product_id
        )
        WHERE id = NEW.product_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE products
        SET quantity = (
            SELECT COALESCE(SUM(quantity), 0) 
            FROM product_variations 
            WHERE product_id = OLD.product_id
        )
        WHERE id = OLD.product_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires after any change to product_variations
CREATE TRIGGER update_product_quantity_trigger
    AFTER INSERT OR UPDATE OR DELETE ON product_variations
    FOR EACH ROW
    EXECUTE FUNCTION update_product_quantity();
