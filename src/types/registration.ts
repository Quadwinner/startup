/**
 * Types for tournament registrations
 */

export interface Tournament {
  id: string;
  name: string;
  game: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  format?: string;
  status?: string;
  created_at?: string;
}

export interface Captain {
  name?: string;
  email?: string;
  phone?: string;
}

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  user_id: string;
  team_name?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  captain?: Captain;
  tournament?: Tournament;
}
