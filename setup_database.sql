-- Epic Esports Database Setup Script
-- Run this in the Supabase SQL Editor to set up your database

-- First, drop existing tables if they exist
DROP TABLE IF EXISTS tournament_registrations;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS tournaments;

-- Create the tournaments table
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  game_image TEXT,
  banner_image TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  registration_deadline TEXT NOT NULL,
  prize_pool TEXT NOT NULL,
  team_size INTEGER NOT NULL,
  max_teams INTEGER NOT NULL,
  current_teams INTEGER DEFAULT 0,
  location TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  registration_fee INTEGER DEFAULT 0,
  format TEXT,
  description TEXT,
  rules TEXT,
  organizer JSONB,
  prizes JSONB,
  schedule JSONB,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

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
CREATE TABLE tournament_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  team_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'registered',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(player_id, tournament_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;

-- Create function to increment tournament team count when a player registers
CREATE OR REPLACE FUNCTION increment_tournament_teams(tournament_id UUID)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE tournaments
  SET current_teams = current_teams + 1
  WHERE id = tournament_id;
END;
$$;

-- Create policies for Row Level Security
-- For tournaments table
CREATE POLICY "Allow public read access on tournaments" 
ON tournaments FOR SELECT 
USING (true);

CREATE POLICY "Allow all inserts on tournaments for development" 
ON tournaments FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all updates on tournaments for development" 
ON tournaments FOR UPDATE 
USING (true)
WITH CHECK (true);

-- For players table
CREATE POLICY "Allow public read access on players" 
ON players FOR SELECT 
USING (true);

CREATE POLICY "Allow all inserts on players for development" 
ON players FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all updates on players for development" 
ON players FOR UPDATE 
USING (true)
WITH CHECK (true);

-- For tournament_registrations table
CREATE POLICY "Allow public read access on registrations" 
ON tournament_registrations FOR SELECT 
USING (true);

CREATE POLICY "Allow all inserts on registrations for development" 
ON tournament_registrations FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_tournaments_game ON tournaments(game);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_players_main_game ON players(main_game);
CREATE INDEX idx_players_win_rate ON players(win_rate DESC);
CREATE INDEX idx_registrations_player_id ON tournament_registrations(player_id);
CREATE INDEX idx_registrations_tournament_id ON tournament_registrations(tournament_id);

-- Sample comment explaining the tables
COMMENT ON TABLE tournaments IS 'Stores tournament information for the EpicEsports platform';
COMMENT ON TABLE players IS 'Stores player profiles for the EpicEsports platform';
COMMENT ON TABLE tournament_registrations IS 'Tracks player registrations for tournaments'; 