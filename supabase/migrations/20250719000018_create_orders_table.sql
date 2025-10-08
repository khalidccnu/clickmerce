-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    code VARCHAR UNIQUE,
    products JSONB,
    redeem_amount DECIMAL(10,2) DEFAULT 0,
    vat_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    delivery_charge DECIMAL(10,2) DEFAULT 0,
    pay_amount DECIMAL(10,2) DEFAULT 0,
    due_amount DECIMAL(10,2) DEFAULT 0,
    sub_total_amount DECIMAL(10,2) DEFAULT 0,
    grand_total_amount DECIMAL(10,2) DEFAULT 0,
    round_off_amount DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR,
    status VARCHAR DEFAULT 'PROCESSING',
    
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    payment_method_id UUID REFERENCES payment_methods(id) ON DELETE CASCADE,
    delivery_zone_id UUID REFERENCES delivery_zones(id) ON DELETE CASCADE,
    created_by_id UUID REFERENCES users(id) ON DELETE NO ACTION,
    updated_by_id UUID REFERENCES users(id) ON DELETE NO ACTION,
    
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(code);
CREATE INDEX IF NOT EXISTS idx_orders_redeem_amount ON orders(redeem_amount);
CREATE INDEX IF NOT EXISTS idx_orders_vat_amount ON orders(vat_amount);
CREATE INDEX IF NOT EXISTS idx_orders_tax_amount ON orders(tax_amount);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_charge ON orders(delivery_charge);
CREATE INDEX IF NOT EXISTS idx_orders_pay_amount ON orders(pay_amount);
CREATE INDEX IF NOT EXISTS idx_orders_due_amount ON orders(due_amount);
CREATE INDEX IF NOT EXISTS idx_orders_sub_total_amount ON orders(sub_total_amount);
CREATE INDEX IF NOT EXISTS idx_orders_grand_total_amount ON orders(grand_total_amount);
CREATE INDEX IF NOT EXISTS idx_orders_round_off_amount ON orders(round_off_amount);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method_id ON orders(payment_method_id);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_zone_id ON orders(delivery_zone_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_by_id ON orders(created_by_id);
CREATE INDEX IF NOT EXISTS idx_orders_updated_by_id ON orders(updated_by_id);
CREATE INDEX IF NOT EXISTS idx_orders_is_draft ON orders(is_draft);
CREATE INDEX IF NOT EXISTS idx_orders_is_active ON orders(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_updated_at ON orders(updated_at);

-- Index for JSONB products column
CREATE INDEX IF NOT EXISTS idx_orders_products ON orders USING GIN (products);
