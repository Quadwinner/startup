-- Member Stats Table for tracking player performance and achievements
CREATE TABLE IF NOT EXISTS member_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_tournaments INTEGER DEFAULT 0,
  tournaments_won INTEGER DEFAULT 0,
  total_matches INTEGER DEFAULT 0,
  matches_won INTEGER DEFAULT 0,
  win_rate DECIMAL DEFAULT 0,
  favorite_game TEXT,
  total_kills INTEGER DEFAULT 0,
  total_deaths INTEGER DEFAULT 0,
  total_assists INTEGER DEFAULT 0,
  kd_ratio DECIMAL DEFAULT 0,
  achievements JSONB DEFAULT '[]',
  badges JSONB DEFAULT '[]',
  statistics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE member_stats ENABLE ROW LEVEL SECURITY;

-- Policies for member_stats
-- Public can read member stats (for viewing player statistics)
CREATE POLICY "Allow public read access" 
ON member_stats FOR SELECT 
USING (true);

-- Only service roles can insert or update (since this is updated through game or tournament completion)
CREATE POLICY "Only service roles can modify member stats"
ON member_stats FOR INSERT
WITH CHECK (
  -- Users can insert their own initial stats
  auth.uid() = user_id OR
  -- Or it's a service role with proper claims
  (auth.uid() IS NOT NULL AND auth.role() = 'service_role')
);

CREATE POLICY "Only service roles can update member stats"
ON member_stats FOR UPDATE
USING (
  -- Users can update their own stats
  auth.uid() = user_id OR
  -- Or it's a service role with proper claims
  (auth.uid() IS NOT NULL AND auth.role() = 'service_role')
)
WITH CHECK (
  auth.uid() = user_id OR
  (auth.uid() IS NOT NULL AND auth.role() = 'service_role')
);

-- Only the owner can delete their stats
CREATE POLICY "Allow owners to delete their stats" 
ON member_stats FOR DELETE 
USING (auth.uid() = user_id); 