-- Fix for player_tournament_history view
-- This adds the user_id column that's being queried

-- Drop the existing view
DROP VIEW IF EXISTS public.player_tournament_history;

-- Create corrected view with user_id
CREATE OR REPLACE VIEW public.player_tournament_history AS
SELECT 
  p.id AS player_id,
  p.user_id, -- Added user_id column
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
  public.tournaments t ON tr.tournament_id = t.id; 