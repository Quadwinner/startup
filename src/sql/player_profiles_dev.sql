-- Player Profile Table Setup for Epic Esports - DEVELOPMENT VERSION
-- This script creates the player_profiles table without foreign key constraints for easier development testing

-- Drop the table if it exists, including any dependent objects like views
DROP TABLE IF EXISTS player_profiles CASCADE;

-- Create the player profiles table without foreign key constraints
CREATE TABLE player_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT, -- Changed from UUID with foreign key constraint to TEXT for easier development
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

-- FOR DEVELOPMENT ONLY: Create permissive policies that don't require authentication
-- This allows easy testing without auth setup

-- Allow all operations for development
CREATE POLICY "Allow all operations for development"
   ON player_profiles
   FOR ALL
   USING (true)
   WITH CHECK (true);

-- Create indexes for better query performance
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

-- IMPORTANT: This script is for development and testing only.
-- For production, use the regular player_profiles_table.sql script with proper foreign key constraints
-- and restrictive Row Level Security policies. 

-- Recreate the player_tournament_history view that was dropped by CASCADE
CREATE OR REPLACE VIEW player_tournament_history AS
SELECT 
  p.id AS player_id,
  p.username,
  p.display_name,
  t.id AS tournament_id,
  t.name AS tournament_name,
  t.game,
  t.start_date,
  t.end_date,
  t.status,
  tr.id AS registration_id,
  tr.created_at AS registration_date,
  tr.status AS registration_status
FROM 
  player_profiles p
LEFT JOIN 
  tournament_registrations tr ON p.id = tr.player_id
LEFT JOIN 
  tournaments t ON tr.tournament_id = t.id
WHERE 
  tr.id IS NOT NULL; 