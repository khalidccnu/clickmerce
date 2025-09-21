-- Create product_variations table
CREATE TABLE IF NOT EXISTS product_variations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    cost_price DECIMAL(10,2) DEFAULT 0 NOT NULL,
    sale_price DECIMAL(10,2) DEFAULT 0 NOT NULL,
    quantity INTEGER NOT NULL,
    mfg TIMESTAMPTZ,
    exp TIMESTAMPTZ,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_variations_cost_price ON product_variations(cost_price);
CREATE INDEX IF NOT EXISTS idx_product_variations_sale_price ON product_variations(sale_price);
CREATE INDEX IF NOT EXISTS idx_product_variations_quantity ON product_variations(quantity);
CREATE INDEX IF NOT EXISTS idx_product_variations_mfg ON product_variations(mfg);
CREATE INDEX IF NOT EXISTS idx_product_variations_exp ON product_variations(exp);
CREATE INDEX IF NOT EXISTS idx_product_variations_product_id ON product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variations_is_active ON product_variations(is_active);

-- Create updated_at trigger
CREATE TRIGGER update_product_variations_updated_at 
    BEFORE UPDATE ON product_variations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
