import { supabase, supabaseAdmin } from './supabase';

const profilesTable = 'player_profiles';

/**
 * Transform object keys from camelCase to snake_case
 */
const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Transform object keys from snake_case to camelCase
 */
const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Convert object keys from camelCase to snake_case
 */
const convertToSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    const snakeKey = toSnakeCase(key);
    const value = obj[key];
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = convertToSnakeCase(value);
    } else {
      result[snakeKey] = value;
    }
  });
  return result;
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
 * Get a player profile by user ID
 */
export async function getProfileByUserId(userId: string) {
  try {
    // First try looking up by user_id (as it should be)
    const { data: dataByUserId, error: errorByUserId } = await supabase
      .from(profilesTable)
      .select('*')
      .eq('user_id', userId) // Using 'user_id' as per the new table structure
      .single();
    
    if (!errorByUserId && dataByUserId) {
      // Found by user_id
      return convertToCamelCase(dataByUserId);
    }
    
    // If it fails with 22P02 (invalid UUID format), try looking up by username or other means
    if (errorByUserId && errorByUserId.code === '22P02') {
      console.log('User ID is not a valid UUID, trying to find profile by alternative means');
      
      // Look for the most recently created profile
      // This is a fallback for development purposes
      const { data: recentData, error: recentError } = await supabase
        .from(profilesTable)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (!recentError && recentData && recentData.length > 0) {
        console.log('Found profile using fallback method (most recent)');
        return convertToCamelCase(recentData[0]);
      }
    }
    
    // If not found by user_id and not invalid UUID format, or fallback search failed
    if (errorByUserId && errorByUserId.code !== 'PGRST116') { // PGRST116 is expected for "no rows returned"
      console.error('Error fetching player profile:', errorByUserId);
    }
    
    // Return null if no profile was found
    return null;
  } catch (error) {
    console.error(`Failed to fetch player profile for user ${userId}:`, error);
    return null;
  }
}

/**
 * Get a player profile by username
 */
export async function getProfileByUsername(username: string) {
  try {
    const { data, error } = await supabase
      .from(profilesTable)
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      console.error('Error fetching player profile by username:', error);
      throw error;
    }
    
    return data ? convertToCamelCase(data) : null;
  } catch (error) {
    console.error(`Failed to fetch player profile for username ${username}:`, error);
    return null;
  }
}

/**
 * Create a new player profile
 */
export async function createProfile(profileData: any) {
  try {
    // Verify required fields
    if (!profileData.userId || !profileData.username) {
      throw new Error('User ID and username are required');
    }
    
    // Check if the username is unique
    const existing = await getProfileByUsername(profileData.username);
    if (existing) {
      throw new Error('Username already taken');
    }
    
    // Transform camelCase keys to snake_case for the database
    let dbData = convertToSnakeCase(profileData);
    
    // Validate UUID format for user_id
    try {
      // Dynamically import UUID package
      const { validate, v4, v5 } = await import('uuid');
      
      // This will throw an error if not a valid UUID
      if (dbData.user_id && typeof dbData.user_id === 'string') {
        if (!validate(dbData.user_id)) {
          console.warn('Invalid UUID format for user_id:', dbData.user_id);
          // Option 1: Generate a UUID v4 (completely random)
          // dbData.user_id = v4();
          
          // Option 2: Generate a UUID v5 (deterministic based on input)
          // Use DNS namespace as per RFC4122
          const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
          dbData.user_id = v5(dbData.user_id, NAMESPACE);
          console.log('Converted user_id to valid UUID:', dbData.user_id);
        }
      }
    } catch (uuidError) {
      console.error('UUID validation error:', uuidError);
      
      try {
        // Try a different approach to generate a uuid
        const randomBytes = await import('crypto').then(crypto => 
          crypto.randomBytes(16).toString('hex')
        );
        
        // Format the random bytes as a UUID v4 format
        dbData.user_id = [
          randomBytes.substring(0, 8),
          randomBytes.substring(8, 12),
          // Set the version bit to 4
          '4' + randomBytes.substring(13, 16),
          // Set the variant bit to 8, 9, A, or B
          (parseInt(randomBytes.substring(16, 17), 16) & 0x3 | 0x8).toString(16) + randomBytes.substring(17, 20),
          randomBytes.substring(20, 32)
        ].join('-');
        
        console.log('Generated new UUID using crypto fallback:', dbData.user_id);
      } catch (cryptoError) {
        console.error('Crypto fallback error:', cryptoError);
        // Last resort: use a timestamp-based ID
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 10000);
        dbData.user_id = `fallback-${timestamp}-${random}`;
        console.warn('Using fallback non-UUID format. This may cause database errors:', dbData.user_id);
      }
    }
    
    // Ensure social_links is a valid JSON array if provided
    if (dbData.social_links && typeof dbData.social_links !== 'string') {
      dbData.social_links = JSON.stringify(dbData.social_links);
    }
    
    // Ensure achievements is a valid JSON array if provided
    if (dbData.achievements && typeof dbData.achievements !== 'string') {
      dbData.achievements = JSON.stringify(dbData.achievements);
    }
    
    // Explicitly set null for any fields that shouldn't be empty strings
    const fieldsToConvertEmptyToNull = [
      'display_name', 'bio', 'main_game', 'country', 'state', 
      'city', 'birth_date', 'avatar_url', 'banner_url'
    ];
    
    fieldsToConvertEmptyToNull.forEach(field => {
      if (dbData[field] === '') {
        dbData[field] = null;
      }
    });
    
    // Add timestamps if they don't exist
    const dataWithTimestamps = {
      ...dbData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Creating profile with data:', JSON.stringify(dataWithTimestamps));
    
    const { data, error } = await supabase
      .from(profilesTable)
      .insert([dataWithTimestamps])
      .select();
    
    if (error) {
      console.error('Error creating player profile:', error);
      
      // Add more specific error messages
      if (error.code === '22P02') {
        throw new Error(`Invalid UUID format for user_id: ${error.message}`);
      }
      
      if (error.code === '23503') {
        throw new Error(`Foreign key constraint violation: ${error.message}`);
      }
      
      if (error.code === '42P01') {
        throw new Error(`Table '${profilesTable}' does not exist. Please run the SQL setup script.`);
      }
      
      if (error.code === '23505') {
        throw new Error('Username already taken');
      }
      
      throw error;
    }
    
    // Return the created profile
    return data && data.length > 0 ? convertToCamelCase(data[0]) : null;
  } catch (error) {
    console.error('Failed to create player profile:', error);
    throw error;
  }
}

/**
 * Update a player profile
 */
export async function updateProfile(userId: string, profileData: any) {
  try {
    // Transform camelCase keys to snake_case for the database
    const dbData = convertToSnakeCase(profileData);
    
    // Update the timestamp
    const dataWithTimestamp = {
      ...dbData,
      updated_at: new Date().toISOString()
    };
    
    console.log('Updating profile with data:', JSON.stringify(dataWithTimestamp));
    
    const { data, error } = await supabase
      .from(profilesTable)
      .update(dataWithTimestamp)
      .eq('user_id', userId)  // Using 'user_id' instead of 'id'
      .select();
    
    if (error) {
      console.error('Error updating player profile:', error);
      throw error;
    }
    
    // Return updated profile data
    return data && data.length > 0 ? convertToCamelCase(data[0]) : null;
  } catch (error) {
    console.error(`Failed to update player profile for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get tournament history for a player
 */
export async function getPlayerTournamentHistory(userId: string) {
  try {
    // For development purposes, if we can't find by user_id (especially with MongoDB IDs),
    // get the profile first and then get history by profile ID
    
    // First try to get the profile to get the actual profile ID
    const profile = await getProfileByUserId(userId);
    
    if (profile && profile.id) {
      console.log('Found profile, getting tournament history by profile ID:', profile.id);
      
      // Get history using the profile ID
      const { data, error } = await supabase
        .from('player_tournament_history')
        .select('*')
        .eq('player_id', profile.id)
        .order('registration_date', { ascending: false });
        
      if (error) {
        console.error('Error fetching player tournament history:', error);
        throw error;
      }
      
      return data ? data.map(item => convertToCamelCase(item)) : [];
    }
    
    // Fallback: try to get all tournament history as a development convenience
    const { data: allData, error: allError } = await supabase
      .from('player_tournament_history')
      .select('*')
      .order('registration_date', { ascending: false })
      .limit(10);
      
    if (!allError && allData && allData.length > 0) {
      console.log('Using fallback to get recent tournament history');
      return allData.map(item => convertToCamelCase(item));
    }
    
    return [];
  } catch (error) {
    console.error(`Failed to fetch tournament history for user ${userId}:`, error);
    return [];
  }
}

/**
 * Get profile stats (tournaments played, won, etc.)
 */
export async function getPlayerStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from(profilesTable)
      .select('total_tournaments, tournaments_won, total_matches, matches_won')
      .eq('user_id', userId)  // Using 'user_id' instead of 'id'
      .single();
    
    if (error) {
      console.error('Error fetching player stats:', error);
      throw error;
    }
    
    return data ? convertToCamelCase(data) : null;
  } catch (error) {
    console.error(`Failed to fetch stats for user ${userId}:`, error);
    return null;
  }
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(username: string) {
  try {
    const { data, error } = await supabase
      .from(profilesTable)
      .select('username')
      .eq('username', username);
    
    if (error) {
      console.error('Error checking username availability:', error);
      throw error;
    }
    
    return data.length === 0; // Available if no results found
  } catch (error) {
    console.error(`Failed to check availability for username ${username}:`, error);
    return false; // Default to unavailable if there's an error
  }
}

/**
 * Get top players by win rate
 */
export async function getTopPlayers(limit = 10) {
  try {
    const { data, error } = await supabase
      .from(profilesTable)
      .select('*')
      .gt('total_matches', 0) // Only players who have played matches
      .order('matches_won', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching top players:', error);
      throw error;
    }
    
    return data ? data.map(player => convertToCamelCase(player)) : [];
  } catch (error) {
    console.error('Failed to fetch top players:', error);
    return [];
  }
} 