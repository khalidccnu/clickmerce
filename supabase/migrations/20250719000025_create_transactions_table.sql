-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    code VARCHAR UNIQUE NOT NULL,
    type VARCHAR NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    note TEXT,

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_code ON transactions(code);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_by_id ON transactions(created_by_id);
CREATE INDEX IF NOT EXISTS idx_transactions_is_active ON transactions(is_active);
