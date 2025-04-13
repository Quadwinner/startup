-- User Profiles Table for more detailed user information
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'pro')),
  main_game TEXT,
  secondary_games TEXT[],
  country TEXT,
  state TEXT,
  city TEXT,
  birth_date DATE,
  social_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
-- Public can read profiles (for viewing player profiles)
CREATE POLICY "Allow public read access" 
ON user_profiles FOR SELECT 
USING (true);

-- Only the owner can update their profile
CREATE POLICY "Allow owners to update their profiles" 
ON user_profiles FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only the owner can delete their profile
CREATE POLICY "Allow owners to delete their profiles" 
ON user_profiles FOR DELETE 
USING (auth.uid() = user_id);

-- Create a view for user settings (for internal use)
CREATE OR REPLACE VIEW user_settings AS
SELECT 
  id,
  user_id,
  username,
  email,
  experience_level,
  created_at,
  updated_at
FROM user_profiles; 