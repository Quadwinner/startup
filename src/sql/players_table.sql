-- Players table setup for Epic Esports
-- Development version with permissive RLS policies

-- Drop the table if it exists
DROP TABLE IF EXISTS players;

-- Create the players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    display_name TEXT,
    main_game TEXT,
    email TEXT UNIQUE,
    profile_image TEXT,
    win_rate FLOAT DEFAULT 0,
    total_matches INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    bio TEXT,   
    location TEXT,
    social_links JSONB DEFAULT '[]'::jsonb,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- FOR DEVELOPMENT: Create permissive policies that don't require authentication
-- This makes it easier to test the app without worrying about auth

-- Allow read access to all
CREATE POLICY "Allow public read access on players for development" 
ON players FOR SELECT USING (true);

-- Allow all inserts for development
CREATE POLICY "Allow all inserts on players for development" 
ON players FOR INSERT WITH CHECK (true);

-- Allow all updates for development
CREATE POLICY "Allow all updates on players for development" 
ON players FOR UPDATE USING (true) WITH CHECK (true);

-- Allow all deletes for development
CREATE POLICY "Allow all deletes on players for development" 
ON players FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_players_username ON players(username);
CREATE INDEX idx_players_main_game ON players(main_game);
CREATE INDEX idx_players_user_id ON players(user_id);

-- Note for production:
-- For production, you should replace these policies with more restrictive ones:
/*
-- Allow all users to read players (public data)
CREATE POLICY "Allow public read access on players" 
ON players FOR SELECT 
USING (true);

-- Allow authenticated users to create their own player profile
CREATE POLICY "Allow authenticated insert" 
ON players FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own profile
CREATE POLICY "Allow users to update own profile" 
ON players FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete only their own profile
CREATE POLICY "Allow users to delete own profile" 
ON players FOR DELETE 
USING (auth.uid() = user_id);
*/ 