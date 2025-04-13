-- Drop the existing table if it exists
DROP TABLE IF EXISTS profiles;

-- Create the profiles table with proper PostgreSQL types
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    role TEXT DEFAULT 'member',
    image TEXT,
    bio TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
-- Allow anyone to read profiles
CREATE POLICY "Allow public read access"
    ON profiles
    FOR SELECT
    USING (true);

-- Allow authenticated users to create their own profile
CREATE POLICY "Allow users to create own profile"
    ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Allow users to update only their own profile
CREATE POLICY "Allow users to update own profile"
    ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- For development, you might want a more permissive policy
-- Comment out the above policies and uncomment these for testing
-- CREATE POLICY "Allow all operations for development"
--    ON profiles
--    FOR ALL
--    USING (true)
--    WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX profiles_email_idx ON profiles (email);
CREATE INDEX profiles_role_idx ON profiles (role);

-- Sample comment explaining the table
COMMENT ON TABLE profiles IS 'User profiles for the EpicEsports platform';

-- Create an auth.users trigger to automatically create a profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 