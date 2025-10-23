-- Create galleries table
CREATE TABLE IF NOT EXISTS galleries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    file_name VARCHAR UNIQUE NOT NULL,
    file_path VARCHAR NOT NULL,
    file_url VARCHAR NOT NULL,
    bucket VARCHAR NOT NULL,
    etag VARCHAR,
    version_id VARCHAR,

    -- Ensure unique combinations of bucket, file_path, and version_id
    UNIQUE(bucket, file_path, version_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_galleries_bucket ON galleries(bucket);
CREATE INDEX IF NOT EXISTS idx_galleries_file_name ON galleries(file_name);
