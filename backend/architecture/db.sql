-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    username VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tokens Table
CREATE TABLE IF NOT EXISTS tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50) NOT NULL,
    decimals INTEGER NOT NULL,
    logo_url VARCHAR(255),
    price DECIMAL(36, 18) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_stakeable BOOLEAN DEFAULT FALSE,
    is_swappable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Swaps Table
CREATE TABLE IF NOT EXISTS swaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    from_token_id UUID NOT NULL REFERENCES tokens(id),
    to_token_id UUID NOT NULL REFERENCES tokens(id),
    from_amount DECIMAL(36, 18) NOT NULL,
    to_amount DECIMAL(36, 18) NOT NULL,
    tx_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stakes Table
CREATE TABLE IF NOT EXISTS stakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    token_id UUID NOT NULL REFERENCES tokens(id),
    amount DECIMAL(36, 18) NOT NULL,
    rewards DECIMAL(36, 18) DEFAULT 0,
    tx_hash VARCHAR(255) NOT NULL,
    unstake_tx_hash VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_tokens_address ON tokens(address);
CREATE INDEX IF NOT EXISTS idx_swaps_user_id ON swaps(user_id);
CREATE INDEX IF NOT EXISTS idx_stakes_user_id ON stakes(user_id);
CREATE INDEX IF NOT EXISTS idx_stakes_status ON stakes(status);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to tables with updated_at column
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tokens_updated_at
BEFORE UPDATE ON tokens
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stakes_updated_at
BEFORE UPDATE ON stakes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample tokens
INSERT INTO tokens (address, name, symbol, decimals, price, is_active, is_stakeable, is_swappable)
VALUES 
('0x0000000000000000000000000000000000000000', 'Ethereum', 'ETH', 18, 3000, TRUE, TRUE, TRUE),
('0x1111111111111111111111111111111111111111', 'USD Coin', 'USDC', 6, 1, TRUE, FALSE, TRUE),
('0x2222222222222222222222222222222222222222', 'Dai Stablecoin', 'DAI', 18, 1, TRUE, FALSE, TRUE),
('0x3333333333333333333333333333333333333333', 'Platform Token', 'PLT', 18, 5, TRUE, TRUE, TRUE)
ON CONFLICT (address) DO NOTHING;

-- Insert a sample admin user
INSERT INTO users (wallet_address, email, username, is_admin)
VALUES ('0xadmin1111111111111111111111111111111111111', 'admin@example.com', 'admin', TRUE)
ON CONFLICT (wallet_address) DO NOTHING;

-- Insert a sample regular user
INSERT INTO users (wallet_address, email, username, is_admin)
VALUES (
    '0x99f2bf7a98ecf703e4c84c96ec4822a44f408dfc',
    'siabang35@gmail.com',
    'siabang',
    FALSE
)
ON CONFLICT (wallet_address) DO NOTHING;

-- Get the IDs for sample data
DO $$
DECLARE
    eth_token_id UUID;
    usdc_token_id UUID;
    admin_user_id UUID;
    regular_user_id UUID;
BEGIN
    -- Get token IDs
    SELECT id INTO eth_token_id FROM tokens WHERE symbol = 'ETH' LIMIT 1;
    SELECT id INTO usdc_token_id FROM tokens WHERE symbol = 'USDC' LIMIT 1;
    
    -- Get user IDs
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@example.com' LIMIT 1;
    SELECT id INTO regular_user_id FROM users WHERE email = 'user@example.com' LIMIT 1;
    
    -- Insert sample swap
    IF eth_token_id IS NOT NULL AND usdc_token_id IS NOT NULL AND regular_user_id IS NOT NULL THEN
        INSERT INTO swaps (user_id, from_token_id, to_token_id, from_amount, to_amount, tx_hash, status)
        VALUES (
            regular_user_id,
            eth_token_id,
            usdc_token_id,
            1.5,
            4500,
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            'completed'
        );
    END IF;
    
    -- Insert sample stake
    IF eth_token_id IS NOT NULL AND regular_user_id IS NOT NULL THEN
        INSERT INTO stakes (user_id, token_id, amount, tx_hash, status)
        VALUES (
            regular_user_id,
            eth_token_id,
            5.0,
            '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            'active'
        );
    END IF;
END $$;

-- Create RLS policies (optional, uncomment if you want to use RLS)
/*
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE swaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY users_policy ON users 
    USING (is_admin OR id = auth.uid());

CREATE POLICY tokens_select_policy ON tokens 
    FOR SELECT USING (true);

CREATE POLICY swaps_select_policy ON swaps 
    FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin));

CREATE POLICY stakes_select_policy ON stakes 
    FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin));
*/

-- Grant permissions to authenticated users (adjust as needed)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE, DELETE ON users, tokens, swaps, stakes TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;