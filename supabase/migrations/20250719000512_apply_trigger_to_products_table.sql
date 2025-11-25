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

-- Function to search products with similarity scoring
create or replace function search_products(q text)
returns table (
  product products,
  score real
)
language sql
as $$
  select
    p,
    greatest(
      -- fuzzy only for 3+ chars
      case when length(q) >= 3 then similarity(p.name, q) else 0 end,
      -- substring match boost
      case when p.name ilike '%' || q || '%' then
        case 
          when length(q) = 1 then 0.4
          when length(q) = 2 then 0.6
          else 0.8
        end
      else 0 end,
      -- prefix match boost
      case when p.name ilike q || '%' then
        case
          when length(q) = 1 then 0.5
          when length(q) = 2 then 0.7
          else 0.9
        end
      else 0 end,
      -- small base score for force match
      0.1
    ) as score
  from products p
  where
    p.is_active = true
  order by score desc, p.name asc
  limit 50;
$$;
