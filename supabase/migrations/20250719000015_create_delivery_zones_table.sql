-- Create delivery_zones table
CREATE TABLE IF NOT EXISTS delivery_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    name VARCHAR NOT NULL UNIQUE,
    delivery_service_type_id UUID REFERENCES delivery_service_types(id) ON DELETE CASCADE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_delivery_zones_name ON delivery_zones(name);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_delivery_service_type_id ON delivery_zones(delivery_service_type_id);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_is_active ON delivery_zones(is_active);
