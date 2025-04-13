import { supabase, supabaseAdmin } from './supabase';

export const playersTable = 'players';

// Helper to convert camelCase to snake_case for database fields
const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// Helper to convert snake_case to camelCase for JavaScript objects
const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Helper to transform keys in an object from camelCase to snake_case
const transformToSnakeCase = (obj: any): any => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Handle special JSON fields like socialLinks
    if (key === 'socialLinks') {
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
const transformToCamelCase = (obj: any): any => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Handle special JSON fields
    if (key === 'social_links') {
      result[snakeToCamel(key)] = value;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[snakeToCamel(key)] = transformToCamelCase(value);
    } else {
      result[snakeToCamel(key)] = value;
    }
  }
  return result;
};

export async function getPlayers({ 
  mainGame = null, 
  username = null,
  sortBy = 'winRate',
  sortOrder = 'desc',
  limit = 20,
  page = 1
} = {}) {
  try {
    let query = supabase
      .from(playersTable)
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (mainGame && mainGame !== 'all') {
      query = query.eq('main_game', mainGame);
    }
    
    if (username) {
      query = query.ilike('username', `%${username}%`);
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Apply sorting
    const snakeCaseSortBy = camelToSnake(sortBy);
    query = query.order(snakeCaseSortBy, { ascending: sortOrder === 'asc' });
    
    // Apply pagination range
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching players from Supabase:', error);
      throw error;
    }
    
    // Transform snake_case database fields to camelCase for frontend
    const transformedData = data?.map(player => transformToCamelCase(player)) || [];
    
    return {
      players: transformedData,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0
      }
    };
  } catch (error) {
    console.error('Failed to fetch players:', error);
    return {
      players: [],
      pagination: {
        total: 0,
        page,
        limit,
        pages: 0
      }
    };
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

export async function getPlayerByUsername(username: string) {
  try {
    const { data, error } = await supabase
      .from(playersTable)
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      console.error('Error fetching player from Supabase:', error);
      throw error;
    }
    
    // Transform snake_case database fields to camelCase for frontend
    return data ? transformToCamelCase(data) : null;
  } catch (error) {
    console.error(`Failed to fetch player with username ${username}:`, error);
    return null;
  }
}

export async function createPlayer(playerData: any) {
  try {
    // Transform camelCase keys to snake_case for the database
    const dbData = transformToSnakeCase(playerData);
    
    // Add created_at and updated_at timestamps if not present
    const dataWithTimestamps = {
      ...dbData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from(playersTable)
      .insert([dataWithTimestamps])
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
    
    // Update the updated_at timestamp
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
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete player with id ${id}:`, error);
    throw error;
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