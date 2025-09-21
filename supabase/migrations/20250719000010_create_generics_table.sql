-- Create generics table
CREATE TABLE IF NOT EXISTS generics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_generics_name ON generics(name);
CREATE INDEX IF NOT EXISTS idx_generics_slug ON generics(slug);
CREATE INDEX IF NOT EXISTS idx_generics_is_active ON generics(is_active);

-- Create updated_at trigger
CREATE TRIGGER update_generics_updated_at 
    BEFORE UPDATE ON generics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
