-- Create RPC function for incrementing counters
CREATE OR REPLACE FUNCTION increment_counter(row_id UUID)
RETURNS INTEGER LANGUAGE SQL SECURITY DEFINER AS $$
  UPDATE tournaments 
  SET current_teams = current_teams + 1 
  WHERE id = row_id 
  RETURNING current_teams;
$$;

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  team_name TEXT NOT NULL,
  team_members JSONB NOT NULL,
  captain JSONB NOT NULL,
  contact_info JSONB,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'processing', 'paid', 'refunded', 'failed')),
  transaction_id TEXT,
  payment_details JSONB,
  notes TEXT,
  is_checked_in BOOLEAN DEFAULT false,
  check_in_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on registrations table
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to registrations
CREATE POLICY "Allow public read access" 
ON registrations FOR SELECT 
USING (true);

-- Create policy allowing authenticated users to create registrations
CREATE POLICY "Allow authenticated insert" 
ON registrations FOR INSERT 
WITH CHECK (true);

-- Create policy allowing users to update their own registrations
CREATE POLICY "Allow own updates" 
ON registrations FOR UPDATE 
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS registrations_tournament_id_idx ON registrations(tournament_id);
CREATE INDEX IF NOT EXISTS registrations_user_id_idx ON registrations(user_id);
CREATE INDEX IF NOT EXISTS registrations_status_idx ON registrations(status); 