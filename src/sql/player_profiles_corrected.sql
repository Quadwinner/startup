-- Player Profile Table Setup for Epic Esports - CORRECTED VERSION
-- This preserves your original structure but makes it development-friendly

-- Drop the table if it exists, including any dependent objects like views
DROP TABLE IF EXISTS public.player_profiles CASCADE;

-- Create the player profiles table with proper structure
CREATE TABLE public.player_profiles (
  id uuid not null default extensions.uuid_generate_v4(),
  user_id uuid null, -- Kept as UUID but NULL allowed for development
  username text not null,
  display_name text null,
  bio text null,
  main_game text null,
  country text null,
  state text null,
  city text null,
  birth_date date null,
  avatar_url text null,
  banner_url text null,
  social_links jsonb null default '[]'::jsonb,
  experience_level text null,
  achievements jsonb null default '[]'::jsonb,
  total_tournaments integer null default 0,
  tournaments_won integer null default 0,
  total_matches integer null default 0,
  matches_won integer null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint player_profiles_pkey primary key (id),
  constraint player_profiles_username_key unique (username),
  -- OPTION 1: Use this constraint for PRODUCTION
  -- constraint player_profiles_user_id_fkey foreign key (user_id) references auth.users (id) on delete CASCADE,
  
  -- OPTION 2: Comment out the constraint for DEVELOPMENT (choose this for now)
  -- Will add the constraint back later for production
  
  constraint player_profiles_experience_level_check check (
    experience_level is null or (
      experience_level = any (
        array[
          'beginner'::text,
          'intermediate'::text,
          'advanced'::text,
          'professional'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

-- Enable RLS on the table
ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes (same as your original)
CREATE INDEX IF NOT EXISTS idx_player_profiles_user_id ON public.player_profiles USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_player_profiles_username ON public.player_profiles USING btree (username) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_player_profiles_main_game ON public.player_profiles USING btree (main_game) TABLESPACE pg_default;

-- FOR DEVELOPMENT ONLY: Create permissive policies that don't require authentication
-- This allows easy testing without auth setup

-- Allow all operations for development
CREATE POLICY "Allow all operations for development"
   ON public.player_profiles
   FOR ALL
   USING (true)
   WITH CHECK (true);

-- Seed one sample profile for testing
INSERT INTO public.player_profiles (
    username, 
    display_name, 
    main_game, 
    bio,
    country,
    experience_level,
    avatar_url,
    social_links
) VALUES (
    'test_player',
    'Test Player',
    'Valorant',
    'This is a test player profile for development',
    'United States',
    'intermediate',
    'https://i.pravatar.cc/300',
    '[{"platform": "twitch", "url": "https://twitch.tv/test_player"}, {"platform": "twitter", "url": "https://twitter.com/test_player"}]'
);

-- OPTIONAL: Recreate the player_tournament_history view that was dropped by CASCADE
-- Only include this if you need the view
CREATE OR REPLACE VIEW public.player_tournament_history AS
SELECT 
  p.id AS player_id,
  p.username,
  p.display_name,
  t.id AS tournament_id,
  t.name AS tournament_name,
  t.game,
  t.start_date,
  t.end_date,
  t.status,
  tr.id AS registration_id,
  tr.created_at AS registration_date,
  tr.status AS registration_status
FROM 
  public.player_profiles p
LEFT JOIN 
  public.tournament_registrations tr ON p.id = tr.player_id
LEFT JOIN 
  public.tournaments t ON tr.tournament_id = t.id
WHERE 
  tr.id IS NOT NULL;

-- INSTRUCTIONS FOR PRODUCTION:
-- When moving to production, uncomment the "OPTION 1" constraint line
-- and comment out or remove the "FOR DEVELOPMENT ONLY" section 