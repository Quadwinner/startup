import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with the public anon key (limited permissions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a Supabase admin client with service role key (full permissions)
// IMPORTANT: Only use this on the server, never expose this client in browser code
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

// Tournament related utility functions
export const tournamentsTable = 'tournaments';

// Event related utility functions
export const eventsTable = 'events';

// Player related utility functions
export const playersTable = 'players';
export const userProfilesTable = 'user_profiles';
export const memberStatsTable = 'member_stats';
export const tournamentsRegistrationTable = 'tournament_registrations';

// Helper to convert camelCase to snake_case for database fields
const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);
};

// Helper to convert snake_case to camelCase for JavaScript objects
const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_: string, letter: string) => letter.toUpperCase());
};

// Helper to transform keys in an object from camelCase to snake_case
const transformToSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip transformation for JSON fields like organizer, prizes, schedule
    if (['organizer', 'prizes', 'schedule'].includes(key)) {
      result[camelToSnake(key)] = value;
    } else if (typeof value === 'object' && value !== null) {
      result[camelToSnake(key)] = transformToSnakeCase(value);
    } else {
      result[camelToSnake(key)] = value;
    }
  }
  return result;
};

// Helper to transform keys in an object from snake_case to camelCase
const transformToCamelCase = (obj: Record<string, any>): Record<string, any> => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip transformation for JSON fields
    if (['organizer', 'prizes', 'schedule'].includes(key)) {
      result[snakeToCamel(key)] = value;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[snakeToCamel(key)] = transformToCamelCase(value);
    } else {
      result[snakeToCamel(key)] = value;
    }
  }
  return result;
};

export async function getTournaments({ 
  game = null, 
  status = null, 
  teamSize = null,
  sortBy = 'startDate',
  featured = false,
  limit = 100
} = {}) {
  try {
    let query = supabase
      .from(tournamentsTable)
      .select('*')
      .limit(limit);
    
    // Apply filters
    if (game && game !== 'all') {
      query = query.eq('game', game);
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (teamSize && teamSize !== 'all') {
      query = query.eq('team_size', parseInt(teamSize));
    }
    
    if (featured) {
      query = query.eq('featured', true);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'startDate':
        query = query.order('start_date', { ascending: true });
        break;
      case 'prize':
        query = query.order('prize_pool', { ascending: false });
        break;
      case 'popularity':
        query = query.order('current_teams', { ascending: false });
        break;
      default:
        query = query.order('start_date', { ascending: true });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching tournaments from Supabase:', error);
      throw error;
    }
    
    // Transform snake_case database fields to camelCase for frontend
    const transformedData = data.map(tournament => transformToCamelCase(tournament));
    return transformedData || [];
  } catch (error) {
    console.error('Failed to fetch tournaments:', error);
    return [];
  }
}

export async function getTournamentById(id: string) {
  try {
    const { data, error } = await supabase
      .from(tournamentsTable)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching tournament from Supabase:', error);
      throw error;
    }
    
    // Transform snake_case database fields to camelCase for frontend
    return data ? transformToCamelCase(data) : null;
  } catch (error) {
    console.error(`Failed to fetch tournament with id ${id}:`, error);
    return null;
  }
}

export async function createTournament(tournamentData: any) {
  try {
    // Transform camelCase keys to snake_case for the database
    const dbData = transformToSnakeCase(tournamentData);
    
    // Add created_at timestamp if not present
    const dataWithTimestamp = {
      ...dbData,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from(tournamentsTable)
      .insert([dataWithTimestamp])
      .select();
    
    if (error) {
      console.error('Error creating tournament in Supabase:', error);
      throw error;
    }
    
    // Transform the response back to camelCase for frontend
    return transformToCamelCase(data[0]);
  } catch (error) {
    console.error('Failed to create tournament:', error);
    throw error;
  }
}

// Function to seed initial tournament data if needed
export async function seedTournaments(sampleTournaments: any[]) {
  try {
    // Transform all tournament data to snake_case for the database
    const dbData = sampleTournaments.map(tournament => transformToSnakeCase(tournament));
    
    // First check if we already have tournaments
    const { count, error: countError } = await supabase
      .from(tournamentsTable)
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw countError;
    }
    
    // If we already have tournaments, don't seed
    if (count && count > 0) {
      return { 
        success: true, 
        message: `Database already contains ${count} tournaments. No seeding needed.`,
        count 
      };
    }
    
    // Otherwise insert sample tournaments
    const { data, error } = await supabase
      .from(tournamentsTable)
      .insert(dbData)
      .select();
    
    if (error) {
      throw error;
    }
    
    return { 
      success: true, 
      message: `Successfully seeded ${data.length} tournaments`,
      count: data.length,
      tournaments: data.map(tournament => transformToCamelCase(tournament))
    };
  } catch (error) {
    console.error('Error seeding tournaments:', error);
    return { 
      success: false, 
      message: 'Failed to seed tournaments',
      error
    };
  }
}

// Event-related functions
export async function getEvents({ 
  type = null, 
  sortBy = 'date',
  limit = 100,
  featured = undefined
} = {}) {
  try {
    let query = supabase
      .from(eventsTable)
      .select('*')
      .limit(limit);
    
    // Apply filters
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    
    if (featured !== undefined) {
      query = query.eq('is_public', featured);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'date':
        query = query.order('date', { ascending: true });
        break;
      case 'title':
        query = query.order('title', { ascending: true });
        break;
      default:
        query = query.order('date', { ascending: true });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching events from Supabase:', error);
      throw error;
    }
    
    // Transform snake_case database fields to camelCase for frontend
    const transformedData = data.map(event => transformToCamelCase(event));
    return transformedData || [];
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
}

export async function getEventById(id: string) {
  try {
    const { data, error } = await supabase
      .from(eventsTable)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching event from Supabase:', error);
      throw error;
    }
    
    // Transform snake_case database fields to camelCase for frontend
    return data ? transformToCamelCase(data) : null;
  } catch (error) {
    console.error(`Failed to fetch event with id ${id}:`, error);
    return null;
  }
}

export async function createEvent(eventData: any) {
  try {
    // Transform camelCase keys to snake_case for the database
    const dbData = transformToSnakeCase(eventData);
    
    // Add created_at timestamp if not present
    const dataWithTimestamp = {
      ...dbData,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from(eventsTable)
      .insert([dataWithTimestamp])
      .select();
    
    if (error) {
      console.error('Error creating event in Supabase:', error);
      throw error;
    }
    
    // Transform the response back to camelCase for frontend
    return transformToCamelCase(data[0]);
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
}

export async function registerForEvent(eventId: string, userData: any) {
  try {
    // Transform camelCase keys to snake_case for the database
    const dbData = transformToSnakeCase(userData);
    
    // Add event_id and timestamps
    const dataWithIds = {
      ...dbData,
      event_id: eventId,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([dataWithIds])
      .select();
    
    if (error) {
      console.error('Error registering for event in Supabase:', error);
      throw error;
    }
    
    // Transform the response back to camelCase for frontend
    return { success: true, registration: transformToCamelCase(data[0]) };
  } catch (error) {
    console.error('Failed to register for event:', error);
    throw error;
  }
}

export async function createEventTicket(ticketData: any) {
  try {
    // Transform camelCase keys to snake_case for the database
    const dbData = transformToSnakeCase(ticketData);
    
    const { data, error } = await supabase
      .from('event_tickets')
      .insert([dbData])
      .select();
    
    if (error) {
      console.error('Error creating event ticket in Supabase:', error);
      throw error;
    }
    
    // Transform the response back to camelCase for frontend
    return { success: true, ticket: transformToCamelCase(data[0]) };
  } catch (error) {
    console.error('Failed to create event ticket:', error);
    throw error;
  }
}

// Function to seed initial event data if needed
export async function seedEvents(sampleEvents: any[]) {
  try {
    // Transform all event data to snake_case for the database
    const dbData = sampleEvents.map(event => transformToSnakeCase(event));
    
    // First check if we already have events
    const { count, error: countError } = await supabase
      .from(eventsTable)
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw countError;
    }
    
    // If we already have events, don't seed
    if (count && count > 0) {
      return { 
        success: true, 
        message: `Database already contains ${count} events. No seeding needed.`,
        count 
      };
    }
    
    // Otherwise insert sample events
    const { data, error } = await supabase
      .from(eventsTable)
      .insert(dbData)
      .select();
    
    if (error) {
      throw error;
    }
    
    return { 
      success: true, 
      message: `Successfully seeded ${data.length} events`,
      count: data.length,
      events: data.map(event => transformToCamelCase(event))
    };
  } catch (error) {
    console.error('Error seeding events:', error);
    return { 
      success: false, 
      message: 'Failed to seed events',
      error
    };
  }
}

// Player-related functions
export async function getPlayers({ 
  username = null,
  email = null,
  limit = 100
} = {}) {
  try {
    let query = supabase
      .from(playersTable)
      .select('*')
      .limit(limit);
    
    // Apply filters
    if (username) {
      query = query.ilike('username', `%${username}%`);
    }
    
    if (email) {
      query = query.eq('email', email);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching players from Supabase:', error);
      throw error;
    }
    
    // Transform snake_case database fields to camelCase for frontend
    const transformedData = data.map(player => transformToCamelCase(player));
    return transformedData || [];
  } catch (error) {
    console.error('Failed to fetch players:', error);
    return [];
  }
}

export async function getPlayerById(id: string) {
  try {
    const { data, error } = await supabase
      .from(playersTable)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching player from Supabase:', error);
      throw error;
    }
    
    // Transform snake_case database fields to camelCase for frontend
    return data ? transformToCamelCase(data) : null;
  } catch (error) {
    console.error(`Failed to fetch player with id ${id}:`, error);
    return null;
  }
}

export async function getPlayerByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from(playersTable)
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error fetching player from Supabase:', error);
      throw error;
    }
    
    // Transform snake_case database fields to camelCase for frontend
    return data ? transformToCamelCase(data) : null;
  } catch (error) {
    console.error(`Failed to fetch player with email ${email}:`, error);
    return null;
  }
}

export async function createPlayer(playerData: any) {
  try {
    // Transform camelCase keys to snake_case for the database
    const dbData = transformToSnakeCase(playerData);
    
    // Add created_at timestamp if not present
    const dataWithTimestamp = {
      ...dbData,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from(playersTable)
      .insert([dataWithTimestamp])
      .select();
    
    if (error) {
      console.error('Error creating player in Supabase:', error);
      throw error;
    }
    
    // Transform the response back to camelCase for frontend
    return transformToCamelCase(data[0]);
  } catch (error) {
    console.error('Failed to create player:', error);
    throw error;
  }
}

export async function updatePlayer(id: string, playerData: any) {
  try {
    // Transform camelCase keys to snake_case for the database
    const dbData = transformToSnakeCase(playerData);
    
    // Add updated_at timestamp
    const dataWithTimestamp = {
      ...dbData,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from(playersTable)
      .update(dataWithTimestamp)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating player in Supabase:', error);
      throw error;
    }
    
    // Transform the response back to camelCase for frontend
    return data && data.length > 0 ? transformToCamelCase(data[0]) : null;
  } catch (error) {
    console.error(`Failed to update player with id ${id}:`, error);
    throw error;
  }
}

export async function deletePlayer(id: string) {
  try {
    const { error } = await supabase
      .from(playersTable)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting player from Supabase:', error);
      throw error;
    }
    
    return { success: true, message: `Player with id ${id} deleted successfully` };
  } catch (error) {
    console.error(`Failed to delete player with id ${id}:`, error);
    throw error;
  }
}

export async function registerPlayerForTournament(playerId: string, tournamentId: string, teamData: any = {}) {
  try {
    const registrationData = {
      player_id: playerId,
      tournament_id: tournamentId,
      team_data: teamData,
      status: 'registered',
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from(tournamentsRegistrationTable)
      .insert([registrationData])
      .select();
    
    if (error) {
      console.error('Error registering player for tournament in Supabase:', error);
      throw error;
    }
    
    // Update current_teams count in the tournament
    await supabase.rpc('increment_tournament_teams', { tournament_id: tournamentId });
    
    // Transform the response back to camelCase for frontend
    return { 
      success: true, 
      registration: transformToCamelCase(data[0])
    };
  } catch (error) {
    console.error('Failed to register player for tournament:', error);
    throw error;
  }
}

export async function getPlayerTournaments(playerId: string) {
  try {
    const { data, error } = await supabase
      .from(tournamentsRegistrationTable)
      .select(`
        *,
        tournament:tournaments(*)
      `)
      .eq('player_id', playerId);
    
    if (error) {
      console.error('Error fetching player tournaments from Supabase:', error);
      throw error;
    }
    
    // Transform snake_case database fields to camelCase for frontend
    const transformedData = data.map(registration => {
      const transformed = transformToCamelCase(registration);
      if (transformed.tournament) {
        transformed.tournament = transformToCamelCase(transformed.tournament);
      }
      return transformed;
    });
    
    return transformedData || [];
  } catch (error) {
    console.error(`Failed to fetch tournaments for player ${playerId}:`, error);
    return [];
  }
}

// Function to seed initial player data if needed
export async function seedPlayers(samplePlayers: any[]) {
  try {
    // Transform all player data to snake_case for the database
    const dbData = samplePlayers.map(player => transformToSnakeCase(player));
    
    // First check if we already have players
    const { count, error: countError } = await supabase
      .from(playersTable)
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw countError;
    }
    
    // If we already have players, don't seed
    if (count && count > 0) {
      return { 
        success: true, 
        message: `Database already contains ${count} players. No seeding needed.`,
        count 
      };
    }
    
    // Otherwise insert sample players
    const { data, error } = await supabase
      .from(playersTable)
      .insert(dbData)
      .select();
    
    if (error) {
      throw error;
    }
    
    return { 
      success: true, 
      message: `Successfully seeded ${data.length} players`,
      count: data.length,
      players: data.map(player => transformToCamelCase(player))
    };
  } catch (error) {
    console.error('Error seeding players:', error);
    return { 
      success: false, 
      message: 'Failed to seed players',
      error
    };
  }
}

// User Profile Related Functions

/**
 * Get a user profile by user ID (auth user ID)
 */
export async function getUserProfileById(userId: string) {
  try {
    const { data, error } = await supabase
      .from(userProfilesTable)
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile from Supabase:', error);
      
      // For development: If the user_profiles table doesn't exist, try the players table
      if (error.code === '42P01') { // relation does not exist
        console.log('User profiles table does not exist, trying players table instead');
        return getPlayerById(userId);
      }
      
      throw error;
    }
    
    return data ? transformToCamelCase(data) : null;
  } catch (error) {
    console.error(`Failed to fetch user profile with id ${userId}:`, error);
    return null;
  }
}

/**
 * Get a user's member statistics
 */
export async function getMemberStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from(memberStatsTable)
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching member stats from Supabase:', error);
      
      // For development: If the member_stats table doesn't exist, return empty stats
      if (error.code === '42P01') { // relation does not exist
        console.log('Member stats table does not exist');
        return null;
      }
      
      throw error;
    }
    
    return data ? transformToCamelCase(data) : null;
  } catch (error) {
    console.error(`Failed to fetch member stats with user id ${userId}:`, error);
    return null;
  }
}

/**
 * Get user tournament registrations with tournament details
 */
export async function getUserTournamentRegistrations(userId: string) {
  try {
    const { data, error } = await supabase
      .from(tournamentsRegistrationTable)
      .select(`
        *,
        tournaments:tournament_id (
          id, name, game, game_image, start_date, end_date, status
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user tournament registrations from Supabase:', error);
      
      // For development: If the tournaments_registrations table doesn't exist
      if (error.code === '42P01') { // relation does not exist
        console.log('Tournament registrations table does not exist');
        return [];
      }
      
      throw error;
    }
    
    // Transform the data including nested tournament data
    return data ? data.map(reg => {
      const transformed = transformToCamelCase(reg);
      if (transformed.tournaments) {
        transformed.tournaments = transformToCamelCase(transformed.tournaments);
      }
      return transformed;
    }) : [];
  } catch (error) {
    console.error(`Failed to fetch tournament registrations for user ${userId}:`, error);
    return [];
  }
}

/**
 * Create or update a user profile
 */
export async function createOrUpdateUserProfile(userId: string, profileData: any) {
  try {
    // Transform camelCase keys to snake_case for the database
    const dbData = transformToSnakeCase({
      ...profileData,
      user_id: userId
    });
    
    // First check if the profile exists
    const { data: existingProfile } = await supabase
      .from(userProfilesTable)
      .select('id')
      .eq('user_id', userId)
      .single();
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from(userProfilesTable)
        .update({
          ...dbData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from(userProfilesTable)
        .insert([{
          ...dbData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      result = data;
    }
    
    // Transform the response back to camelCase for frontend
    return result ? transformToCamelCase(result[0]) : null;
  } catch (error) {
    console.error('Failed to create/update user profile:', error);
    throw error;
  }
} 