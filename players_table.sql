-- Drop the existing table if it exists
DROP TABLE IF EXISTS players;

-- Create the players table with proper PostgreSQL types
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    display_name TEXT,
    main_game TEXT,
    email TEXT,
    profile_image TEXT,
    win_rate FLOAT DEFAULT 0,
    total_matches INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    bio TEXT,
    location TEXT,
    social_links JSONB DEFAULT '[]'::jsonb,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
-- Allow anyone to read players
CREATE POLICY "Allow public read access"
    ON players
    FOR SELECT
    USING (true);

-- Allow authenticated users to create their own player profiles
CREATE POLICY "Allow authenticated insert"
    ON players
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' OR 
        auth.role() = 'anon'  -- For development, also allow anonymous inserts
    );

-- Allow users to update only their own player profile
CREATE POLICY "Allow users to update own profile"
    ON players
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- For development, you might want a more permissive policy
-- Comment out the above policies and uncomment these for testing
-- CREATE POLICY "Allow all operations for development"
--    ON players
--    FOR ALL
--    USING (true)
--    WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX players_username_idx ON players (username);
CREATE INDEX players_main_game_idx ON players (main_game);
CREATE INDEX players_win_rate_idx ON players (win_rate DESC);
CREATE INDEX players_user_id_idx ON players (user_id);

-- Sample comment explaining the table
COMMENT ON TABLE players IS 'Stores player profiles for the EpicEsports platform'; 