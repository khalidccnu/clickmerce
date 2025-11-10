-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Identity information as JSONB
    identity JSONB,
    
    -- S3/Storage configuration as JSONB
    s3 JSONB,

    -- VAT configuration as JSONB
    vat JSONB,

    -- Tax configuration as JSONB
    tax JSONB,

    -- Email configuration as JSONB
    email JSONB,

    -- SMS configuration as JSONB
    sms JSONB,

    -- Tracking codes as JSONB
    tracking_codes JSONB,

    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_settings_is_active ON settings(is_active);
CREATE INDEX IF NOT EXISTS idx_settings_created_at ON settings(created_at);
CREATE INDEX IF NOT EXISTS idx_settings_updated_at ON settings(updated_at);

-- Create GIN indexes for JSONB columns for better query performance
CREATE INDEX IF NOT EXISTS idx_settings_identity_gin ON settings USING GIN (identity);
CREATE INDEX IF NOT EXISTS idx_settings_s3_gin ON settings USING GIN (s3);
CREATE INDEX IF NOT EXISTS idx_settings_vat_gin ON settings USING GIN (vat);
CREATE INDEX IF NOT EXISTS idx_settings_tax_gin ON settings USING GIN (tax);
CREATE INDEX IF NOT EXISTS idx_settings_email_gin ON settings USING GIN (email);
CREATE INDEX IF NOT EXISTS idx_settings_sms_gin ON settings USING GIN (sms);
CREATE INDEX IF NOT EXISTS idx_settings_tracking_codes_gin ON settings USING GIN (tracking_codes);
