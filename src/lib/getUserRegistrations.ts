import { supabase } from './supabase';

/**
 * Transform object keys from snake_case to camelCase
 */
const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Convert object keys from snake_case to camelCase
 */
const convertToCamelCase = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    const camelKey = toCamelCase(key);
    const value = obj[key];
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[camelKey] = convertToCamelCase(value);
    } else {
      result[camelKey] = value;
    }
  });
  return result;
};

/**
 * Get all tournament registrations for a specific user
 * This function fetches from the 'registrations' table
 */
export async function getUserTournamentRegistrations(userId: string) {
  try {
    if (!userId) {
      console.error('getUserTournamentRegistrations: userId is required');
      return [];
    }
    
    console.log(`DEBUG: Fetching tournament registrations for user: ${userId}`);
    
    // First check if the registrations table exists
    try {
      const { count, error: countError } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error checking registrations table:', countError);
      } else {
        console.log(`DEBUG: Total registrations in table: ${count}`);
      }
    } catch (e) {
      console.error('Failed to check registrations table:', e);
    }
    
    // Get registrations from the 'registrations' table
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        tournament:tournaments (
          id, name, game, game_image, start_date, end_date, status, price, currency, description
        )
      `)
      .eq('user_id', userId);
    
    console.log(`DEBUG: Raw query result:`, { data, error });
    
    if (error) {
      console.error('Error fetching user tournament registrations:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log(`DEBUG: No tournament registrations found for user ${userId}`);
      
      // Double check with a different query
      const { data: simpleData, error: simpleError } = await supabase
        .from('registrations')
        .select('id, user_id, team_name')
        .eq('user_id', userId);
        
      console.log('DEBUG: Simple query result:', { simpleData, simpleError });
      
      return [];
    }
    
    console.log(`DEBUG: Found ${data.length} tournament registrations for user ${userId}`);
    console.log('DEBUG: First registration:', data[0]);
    
    // Transform the data into the expected format
    const transformed = data.map(reg => {
      const transformedReg = convertToCamelCase(reg);
      if (transformedReg.tournament) {
        transformedReg.tournament = convertToCamelCase(transformedReg.tournament);
        
        // Remap the tournament data to match the expected structure in the app
        transformedReg.tournaments = {
          id: transformedReg.tournament.id,
          name: transformedReg.tournament.name,
          game: transformedReg.tournament.game,
          gameImage: transformedReg.tournament.gameImage,
          startDate: transformedReg.tournament.startDate,
          endDate: transformedReg.tournament.endDate,
          status: transformedReg.tournament.status,
          price: transformedReg.tournament.price,
          currency: transformedReg.tournament.currency,
          description: transformedReg.tournament.description
        };
      }
      
      return transformedReg;
    });
    
    console.log('DEBUG: Transformed registrations:', transformed);
    return transformed;
  } catch (error) {
    console.error('Failed to fetch user tournament registrations:', error);
    return [];
  }
}
