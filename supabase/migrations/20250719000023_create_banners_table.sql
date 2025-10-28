-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    name VARCHAR NOT NULL,
    url VARCHAR,
    image VARCHAR NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_banners_name ON banners(name);
CREATE INDEX IF NOT EXISTS idx_banners_url ON banners(url);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);
