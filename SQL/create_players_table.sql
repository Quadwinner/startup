-- Players table creation script for Supabase
-- First, drop the table if it exists
DROP TABLE IF EXISTS players;

-- Create the players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    display_name TEXT,
    main_game TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
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

-- Create tournament_registrations table for player tournament registrations
CREATE TABLE IF NOT EXISTS tournament_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  team_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'registered',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(player_id, tournament_id)
);

-- Enable Row Level Security on both tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security on players table
-- Allow all users to read players (public data)
CREATE POLICY "Allow public read access on players" 
ON players FOR SELECT 
USING (true);

-- For development: Allow all inserts for now 
CREATE POLICY "Allow all inserts on players for development" 
ON players FOR INSERT 
WITH CHECK (true);

-- For development: Allow all updates for now
CREATE POLICY "Allow all updates on players for development" 
ON players FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Create policies for tournament_registrations table
CREATE POLICY "Allow public read access on registrations" 
ON tournament_registrations FOR SELECT 
USING (true);

CREATE POLICY "Allow all inserts on registrations for development" 
ON tournament_registrations FOR INSERT 
WITH CHECK (true);

-- Create function to increment tournament team count when a player registers
CREATE OR REPLACE FUNCTION increment_tournament_teams(tournament_id UUID)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE tournaments
  SET current_teams = current_teams + 1
  WHERE id = tournament_id;
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_players_main_game ON players(main_game);
CREATE INDEX idx_players_win_rate ON players(win_rate DESC);
CREATE INDEX idx_registrations_player_id ON tournament_registrations(player_id);
CREATE INDEX idx_registrations_tournament_id ON tournament_registrations(tournament_id);

-- Optional: Create a foreign key relationship with auth.users if needed
-- ALTER TABLE players ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Optional: For development purposes only, you can use a more permissive policy
-- that allows all inserts and updates
-- Uncomment the policies below if you want to use them for development

-- CREATE POLICY "Allow all inserts for development" 
-- ON players FOR INSERT 
-- WITH CHECK (true);

-- CREATE POLICY "Allow all updates for development" 
-- ON players FOR UPDATE 
-- USING (true)
-- WITH CHECK (true); 