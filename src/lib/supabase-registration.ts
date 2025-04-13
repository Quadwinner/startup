import { supabase, supabaseAdmin } from './supabase';
import { camelToSnakeCase, snakeToCamelCase } from './supabase';

const registrationsTable = 'tournament_registrations';

/**
 * Get all registrations for a tournament
 * @param tournamentId Tournament ID to get registrations for
 * @param userId Optional user ID to filter registrations by
 * @returns Array of registrations
 */
export async function getRegistrations(tournamentId: string, userId?: string) {
  try {
    let query = supabase
      .from(registrationsTable)
      .select('*')
      .eq('tournament_id', tournamentId);
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching registrations:', error);
      return { error: error.message };
    }
    
    // Transform response to camelCase
    const transformedData = data.map(item => {
      return Object.entries(item).reduce((acc, [key, value]) => {
        acc[snakeToCamelCase(key)] = value;
        return acc;
      }, {} as Record<string, any>);
    });
    
    return { registrations: transformedData };
  } catch (error) {
    console.error('Error in getRegistrations:', error);
    return { error: 'Failed to fetch registrations' };
  }
}

/**
 * Check if a user has already registered for a tournament
 * @param tournamentId Tournament ID
 * @param userId User ID
 * @returns Boolean indicating if the user is registered
 */
export async function isUserRegistered(tournamentId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from(registrationsTable)
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected if user isn't registered
      console.error('Error checking registration:', error);
      return { error: error.message };
    }
    
    return { isRegistered: !!data };
  } catch (error) {
    console.error('Error in isUserRegistered:', error);
    return { error: 'Failed to check registration status' };
  }
}

/**
 * Register a team for a tournament
 * @param registrationData Registration data
 * @returns Created registration object or error
 */
export async function registerForTournament(registrationData: any) {
  try {
    // Convert camelCase to snake_case for database
    const transformedData = Object.entries(registrationData).reduce((acc, [key, value]) => {
      acc[camelToSnakeCase(key)] = value;
      return acc;
    }, {} as Record<string, any>);
    
    // Add created_at timestamp
    transformedData.created_at = new Date().toISOString();
    
    const { data, error } = await supabaseAdmin
      .from(registrationsTable)
      .insert(transformedData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating registration:', error);
      return { error: error.message };
    }
    
    // Update tournament's current_teams count
    const { error: updateError } = await supabaseAdmin
      .rpc('increment_tournament_teams', { 
        tournament_id: transformedData.tournament_id 
      });
    
    if (updateError) {
      console.error('Error updating tournament team count:', updateError);
      // Registration was created, so return success even with count update failure
      console.warn('Tournament team count not updated, but registration successful');
    }
    
    // Transform response back to camelCase
    const transformedResponse = Object.entries(data).reduce((acc, [key, value]) => {
      acc[snakeToCamelCase(key)] = value;
      return acc;
    }, {} as Record<string, any>);
    
    return { registration: transformedResponse };
  } catch (error) {
    console.error('Error in registerForTournament:', error);
    return { error: 'Failed to create registration' };
  }
}

/**
 * Delete a tournament registration
 * @param registrationId Registration ID to delete
 * @param tournamentId Tournament ID for the registration
 * @returns Success status or error
 */
export async function deleteRegistration(registrationId: string, tournamentId: string) {
  try {
    const { error } = await supabaseAdmin
      .from(registrationsTable)
      .delete()
      .eq('id', registrationId);
    
    if (error) {
      console.error('Error deleting registration:', error);
      return { error: error.message };
    }
    
    // Update tournament's current_teams count
    const { error: updateError } = await supabaseAdmin
      .rpc('decrement_tournament_teams', { 
        tournament_id: tournamentId 
      });
    
    if (updateError) {
      console.error('Error updating tournament team count:', updateError);
      console.warn('Tournament team count not updated, but deletion successful');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in deleteRegistration:', error);
    return { error: 'Failed to delete registration' };
  }
}

/**
 * Creates the necessary SQL functions for tournament registration
 * This should be run once during setup
 */
export async function setupRegistrationFunctions() {
  try {
    // Create function to increment tournament teams
    await supabaseAdmin.rpc('create_increment_function', {
      function_sql: `
      CREATE OR REPLACE FUNCTION increment_tournament_teams(tournament_id UUID)
      RETURNS void AS $$
      BEGIN
        UPDATE tournaments
        SET current_teams = current_teams + 1
        WHERE id = tournament_id;
      END;
      $$ LANGUAGE plpgsql;
      `
    });
    
    // Create function to decrement tournament teams
    await supabaseAdmin.rpc('create_decrement_function', {
      function_sql: `
      CREATE OR REPLACE FUNCTION decrement_tournament_teams(tournament_id UUID)
      RETURNS void AS $$
      BEGIN
        UPDATE tournaments
        SET current_teams = GREATEST(0, current_teams - 1)
        WHERE id = tournament_id;
      END;
      $$ LANGUAGE plpgsql;
      `
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error setting up registration functions:', error);
    return { error: 'Failed to set up registration functions' };
  }
} 