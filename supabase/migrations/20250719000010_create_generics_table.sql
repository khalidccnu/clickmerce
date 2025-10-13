-- Create generics table
CREATE TABLE IF NOT EXISTS generics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    name VARCHAR UNIQUE NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_generics_name ON generics(name);
CREATE INDEX IF NOT EXISTS idx_generics_slug ON generics(slug);
CREATE INDEX IF NOT EXISTS idx_generics_is_active ON generics(is_active);
