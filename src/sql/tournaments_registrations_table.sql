-- Tournament Registrations Table for tracking player/team registrations to tournaments
CREATE TABLE IF NOT EXISTS tournaments_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_name TEXT,
  team_members JSONB DEFAULT '[]',
  captain_info JSONB,
  contact_info JSONB,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_amount DECIMAL DEFAULT 0,
  payment_id TEXT,
  notes TEXT,
  check_in_status BOOLEAN DEFAULT false,
  check_in_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create unique constraint to prevent duplicate registrations
ALTER TABLE tournaments_registrations ADD CONSTRAINT unique_user_tournament
UNIQUE (user_id, tournament_id);

-- Enable Row Level Security
ALTER TABLE tournaments_registrations ENABLE ROW LEVEL SECURITY;

-- Policies for tournament_registrations
-- Public can read registrations for a tournament
CREATE POLICY "Allow public read access" 
ON tournaments_registrations FOR SELECT 
USING (true);

-- Only authenticated users can insert their own registrations
CREATE POLICY "Allow authenticated users to register" 
ON tournaments_registrations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Only the user who registered or admins can update registrations
CREATE POLICY "Allow users to update their registrations" 
ON tournaments_registrations FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only the user who registered can delete their registration
CREATE POLICY "Allow users to delete their registrations" 
ON tournaments_registrations FOR DELETE 
USING (auth.uid() = user_id);

-- Create an index for faster queries
CREATE INDEX tournaments_registrations_tournament_id_idx ON tournaments_registrations(tournament_id);
CREATE INDEX tournaments_registrations_user_id_idx ON tournaments_registrations(user_id); 