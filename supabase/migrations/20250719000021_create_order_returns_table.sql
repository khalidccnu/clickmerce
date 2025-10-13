-- Create order_returns table
CREATE TABLE IF NOT EXISTS order_returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    code VARCHAR UNIQUE,
    products JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    created_by_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_order_returns_code ON order_returns(code);
CREATE INDEX IF NOT EXISTS idx_order_returns_order_id ON order_returns(order_id);
CREATE INDEX IF NOT EXISTS idx_order_returns_created_by_id ON order_returns(created_by_id);
CREATE INDEX IF NOT EXISTS idx_order_returns_is_active ON order_returns(is_active);
CREATE INDEX IF NOT EXISTS idx_order_returns_created_at ON order_returns(created_at);
CREATE INDEX IF NOT EXISTS idx_order_returns_updated_at ON order_returns(updated_at);

-- Index for JSONB products column
CREATE INDEX IF NOT EXISTS idx_order_returns_products ON order_returns USING GIN (products);
