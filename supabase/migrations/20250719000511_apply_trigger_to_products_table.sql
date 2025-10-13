-- Create updated_at trigger
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to get expired products
CREATE OR REPLACE FUNCTION get_expired_products()
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM products p
  WHERE EXISTS (
    SELECT 1 FROM product_variations pv 
    WHERE pv.product_id = p.id AND pv.exp IS NOT NULL
  )
  AND NOT EXISTS (
    SELECT 1 FROM product_variations pv 
    WHERE pv.product_id = p.id 
    AND (pv.exp IS NULL OR pv.exp >= NOW())
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get non-expired products
CREATE OR REPLACE FUNCTION get_non_expired_products()
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT p.*
  FROM products p
  JOIN product_variations pv ON p.id = pv.product_id
  WHERE pv.exp IS NULL OR pv.exp >= NOW();
END;
$$ LANGUAGE plpgsql;
