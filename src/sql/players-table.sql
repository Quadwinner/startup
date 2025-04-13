-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  email TEXT UNIQUE,
  profile_image TEXT,
  main_game TEXT,
  bio TEXT,
  location TEXT,
  user_id UUID,
  win_rate NUMERIC,
  total_matches INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  social_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" 
ON players FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert their own profile
CREATE POLICY "Allow authenticated insert" 
ON players FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own profile
CREATE POLICY "Allow users to update own profile" 
ON players FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy for users to delete their own profile
CREATE POLICY "Allow users to delete own profile" 
ON players FOR DELETE 
USING (auth.uid() = user_id); 