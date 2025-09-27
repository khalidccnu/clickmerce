-- Create delivery_service_types table
CREATE TABLE IF NOT EXISTS delivery_service_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    name VARCHAR NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_delivery_service_types_name ON delivery_service_types(name);
CREATE INDEX IF NOT EXISTS idx_delivery_service_types_amount ON delivery_service_types(amount);
CREATE INDEX IF NOT EXISTS idx_delivery_service_types_is_active ON delivery_service_types(is_active);
