-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    strength VARCHAR,
    type VARCHAR NOT NULL,
    medicine_type VARCHAR,
    durability VARCHAR NOT NULL,
    rack VARCHAR,
    quantity INTEGER DEFAULT 0 NOT NULL,
    dosage_form_id UUID REFERENCES dosage_forms(id) ON DELETE NO ACTION,
    generic_id UUID REFERENCES generics(id) ON DELETE NO ACTION,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE NO ACTION,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_medicine_type ON products(medicine_type);
CREATE INDEX IF NOT EXISTS idx_products_durability ON products(durability);
CREATE INDEX IF NOT EXISTS idx_products_dosage_form_id ON products(dosage_form_id);
CREATE INDEX IF NOT EXISTS idx_products_generic_id ON products(generic_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
