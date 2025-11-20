-- Create order_payment_requests table
CREATE TABLE IF NOT EXISTS order_payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    code VARCHAR UNIQUE,
    payment_reference VARCHAR,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_order_payment_requests_code ON order_payment_requests(code);
CREATE INDEX IF NOT EXISTS idx_order_payment_requests_payment_reference ON order_payment_requests(payment_reference);
CREATE INDEX IF NOT EXISTS idx_order_payment_requests_order_id ON order_payment_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_order_payment_requests_is_active ON order_payment_requests(is_active);
CREATE INDEX IF NOT EXISTS idx_order_payment_requests_created_at ON order_payment_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_order_payment_requests_updated_at ON order_payment_requests(updated_at);
