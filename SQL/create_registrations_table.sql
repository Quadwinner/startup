-- Create Registrations Table for Supabase
-- Drop the table if it exists
DROP TABLE IF EXISTS registrations;

-- Create the registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  team_name TEXT NOT NULL,
  team_members JSONB NOT NULL,
  captain JSONB NOT NULL,
  contact_info JSONB,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'free', 'paid', 'refunded', 'failed')),
  payment_method TEXT,
  transaction_id TEXT,
  payment_details JSONB DEFAULT '{}',
  agreed_to_terms BOOLEAN DEFAULT false,
  notes TEXT,
  is_checked_in BOOLEAN DEFAULT false,
  check_in_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Allow all users to read registrations (public data)
CREATE POLICY "Allow public read access on registrations" 
ON registrations FOR SELECT 
USING (true);

-- For development: Allow all inserts for now 
CREATE POLICY "Allow all inserts on registrations for development" 
ON registrations FOR INSERT 
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
CREATE INDEX idx_registrations_tournament_id ON registrations(tournament_id);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status); 