# Supabase Authentication Setup

This guide walks through setting up authentication with Supabase for the EpicEsports platform. Supabase is used as a replacement for the original MongoDB authentication to improve reliability and performance.

## Environment Variables

Make sure your `.env.local` file has the following Supabase-related variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Setup

### 1. Set Up the Profiles Table

Execute the following SQL in your Supabase SQL Editor:

```sql
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

-- Create indexes for better performance
CREATE INDEX profiles_email_idx ON profiles (email);
CREATE INDEX profiles_role_idx ON profiles (role);

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
```

### 2. Configure Google OAuth (Optional)

If you want to use Google OAuth:

1. Go to your Supabase dashboard > Authentication > OAuth Providers
2. Enable Google provider
3. Add your Google OAuth credentials (Client ID and Secret)
4. Add redirect URLs: `https://your-domain.com/auth/callback`

## Authentication Flow

The authentication system in this application now uses both NextAuth.js and Supabase:

1. **Sign-up**: Uses the Supabase Auth API directly
2. **Sign-in**: Tries Supabase Auth first, then falls back to NextAuth
3. **Google OAuth**: Uses Supabase OAuth with NextAuth fallback
4. **Session management**: Uses both Supabase and NextAuth sessions

## Key Components

The authentication integration consists of several key components:

1. **`src/lib/supabase-auth.ts`**: Utility functions for Supabase authentication
2. **`src/lib/auth.ts`**: NextAuth configuration that integrates with Supabase
3. **`src/components/AuthProvider.tsx`**: Combines NextAuth and Supabase auth contexts
4. **`src/app/auth/callback/route.ts`**: Handles OAuth callback redirects
5. **`src/app/login/page.tsx`**: Login page with Supabase integration
6. **`src/app/register/page.tsx`**: Registration page with Supabase integration

## Gradual Migration

The authentication system is designed to support a gradual migration from MongoDB to Supabase:

1. New users are created in Supabase
2. Existing MongoDB users can still log in via NextAuth
3. As users log in, you may want to migrate their data to Supabase profiles

## Troubleshooting

### Authentication Issues

- If users cannot register, check Supabase auth logs in the dashboard
- For OAuth errors, verify your redirect URL is properly configured

### Row Level Security (RLS) Issues

If users experience permission errors:

```sql
-- Temporarily disable RLS for development
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

### Database Schema Issues

If you encounter errors about missing columns, verify your table schema matches what's expected in the code.

## Next Steps

After setting up authentication, you should:

1. Test registration and login flows
2. Set up proper RLS policies for your production environment
3. Configure email templates in Supabase for password reset, etc.
4. Consider setting up admin roles and permissions 