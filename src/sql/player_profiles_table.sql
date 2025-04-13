-- Player Profile Table Setup for Epic Esports
-- This script creates the enhanced player profile table with development-friendly policies

-- Create the player profiles table
DROP TABLE IF EXISTS player_profiles;

CREATE TABLE player_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT,
    bio TEXT,
    main_game TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    birth_date DATE,
    avatar_url TEXT,
    banner_url TEXT,
    social_links JSONB DEFAULT '[]'::jsonb,
    experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
    achievements JSONB DEFAULT '[]'::jsonb,
    total_tournaments INTEGER DEFAULT 0,
    tournaments_won INTEGER DEFAULT 0,
    total_matches INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;

-- FOR DEVELOPMENT: Create permissive policies that don't require authentication
-- This makes it easier to test the app without worrying about auth

-- Allow read access to all
CREATE POLICY "Allow read access to player profiles for development" 
ON player_profiles FOR SELECT USING (true);

-- Allow all inserts for development
CREATE POLICY "Allow all inserts for development" 
ON player_profiles FOR INSERT WITH CHECK (true);

-- Allow all updates for development
CREATE POLICY "Allow all updates for development" 
ON player_profiles FOR UPDATE USING (true) WITH CHECK (true);

-- Allow all deletes for development
CREATE POLICY "Allow all deletes for development" 
ON player_profiles FOR DELETE USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_player_profiles_user_id ON player_profiles(user_id);
CREATE INDEX idx_player_profiles_username ON player_profiles(username);
CREATE INDEX idx_player_profiles_main_game ON player_profiles(main_game);

-- Seed one sample profile for testing
INSERT INTO player_profiles (
    username, 
    display_name, 
    main_game, 
    bio,
    country,
    experience_level,
    avatar_url,
    social_links
) VALUES (
    'test_player',
    'Test Player',
    'Valorant',
    'This is a test player profile for development',
    'United States',
    'intermediate',
    'https://i.pravatar.cc/300',
    '[{"platform": "twitch", "url": "https://twitch.tv/test_player"}, {"platform": "twitter", "url": "https://twitter.com/test_player"}]'
);

-- Note for production:
-- For production, you should replace these policies with more restrictive ones:
/*
CREATE POLICY "Allow read access to player profiles" 
ON player_profiles FOR SELECT USING (true);

CREATE POLICY "Allow users to update own profile" 
ON player_profiles FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated insert" 
ON player_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own profile" 
ON player_profiles FOR DELETE 
USING (auth.uid() = user_id);
*/ 