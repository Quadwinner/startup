-- Player Profile Table Setup for Epic Esports
-- This script creates the enhanced player profile table and relations

-- First, check if the player_profiles table exists and only create if needed
DO $$
DECLARE
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'player_profiles') THEN
        -- Create the player profiles table
        CREATE TABLE player_profiles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

        -- Create view for tournament history per player
        CREATE OR REPLACE VIEW player_tournament_history AS
        SELECT 
            r.id AS registration_id,
            r.user_id,
            p.username,
            p.display_name,
            t.id AS tournament_id,
            t.name AS tournament_name,
            t.game,
            t.start_date,
            t.end_date,
            r.team_name,
            r.status AS registration_status,
            r.payment_status,
            r.created_at AS registration_date
        FROM registrations r
        JOIN tournaments t ON r.tournament_id = t.id
        LEFT JOIN player_profiles p ON r.user_id = p.user_id::text;
    END IF;
END;
$$;

-- Create trigger function outside of the DO block
CREATE OR REPLACE FUNCTION update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Increment total_tournaments when a player registers for a new tournament
    UPDATE player_profiles
    SET total_tournaments = total_tournaments + 1,
        updated_at = now()
    WHERE user_id::text = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create the trigger if the registrations table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'registrations') THEN
        -- Create trigger on registrations table
        DROP TRIGGER IF EXISTS update_player_profile_stats ON registrations;
        CREATE TRIGGER update_player_profile_stats
        AFTER INSERT ON registrations
        FOR EACH ROW
        EXECUTE FUNCTION update_player_stats();
    END IF;
END;
$$;

-- Enable RLS on the table
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
DROP POLICY IF EXISTS "Allow read access to player profiles" ON player_profiles;
CREATE POLICY "Allow read access to player profiles" 
    ON player_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to update own profile" ON player_profiles;
CREATE POLICY "Allow users to update own profile" 
    ON player_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow authenticated insert" ON player_profiles;
CREATE POLICY "Allow authenticated insert" 
    ON player_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_player_profiles_user_id ON player_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_player_profiles_username ON player_profiles(username);
CREATE INDEX IF NOT EXISTS idx_player_profiles_main_game ON player_profiles(main_game);

-- Success message
SELECT 'Player profile tables and views have been successfully configured.' AS result; 