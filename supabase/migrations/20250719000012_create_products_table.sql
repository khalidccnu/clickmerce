-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    specification VARCHAR,
    type VARCHAR NOT NULL,
    medicine_type VARCHAR,
    durability VARCHAR NOT NULL,
    rack VARCHAR,
    quantity INTEGER DEFAULT 0 NOT NULL,
    description TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    dosage_form_id UUID REFERENCES dosage_forms(id) ON DELETE SET NULL,
    generic_id UUID REFERENCES generics(id) ON DELETE SET NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE NO ACTION,
    is_show_web BOOLEAN NOT NULL DEFAULT TRUE,
    is_recommend BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Enable pg_trgm extension for trigram indexing
create extension if not exists pg_trgm;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
create index if not exists idx_trgm_products_name on products using gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_medicine_type ON products(medicine_type);
CREATE INDEX IF NOT EXISTS idx_products_durability ON products(durability);
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN (images);
CREATE INDEX IF NOT EXISTS idx_products_dosage_form_id ON products(dosage_form_id);
CREATE INDEX IF NOT EXISTS idx_products_generic_id ON products(generic_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_is_show_web ON products(is_show_web);
CREATE INDEX IF NOT EXISTS idx_products_is_recommend ON products(is_recommend);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Add constraint to ensure images is always an array
ALTER TABLE products ADD CONSTRAINT check_products_images_is_array 
    CHECK (jsonb_typeof(images) = 'array');
