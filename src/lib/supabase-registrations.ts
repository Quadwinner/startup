import { supabase, supabaseAdmin } from './supabase';

const registrationsTable = 'registrations';

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
 * Get all registrations for a tournament, optionally filtered by user ID
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
      throw error;
    }
    
    return data ? data.map(item => convertToCamelCase(item)) : [];
  } catch (error) {
    console.error('Exception when fetching registrations:', error);
    return [];
  }
}

/**
 * Get a registration by ID
 */
export async function getRegistrationById(registrationId: string) {
  try {
    const { data, error } = await supabase
      .from(registrationsTable)
      .select('*')
      .eq('id', registrationId)
      .single();
    
    if (error) {
      console.error('Error fetching registration:', error);
      throw error;
    }
    
    return data ? convertToCamelCase(data) : null;
  } catch (error) {
    console.error('Exception when fetching registration:', error);
    return null;
  }
}

/**
 * Create a new registration
 */
export async function createRegistration(registrationData: any) {
  try {
    // Ensure required fields exist
    if (!registrationData.tournamentId || !registrationData.userId || !registrationData.teamName) {
      throw new Error('Missing required registration fields: tournamentId, userId, or teamName');
    }

    // Process payment status
    const paymentStatus = registrationData.paymentStatus || 'unpaid';
    if (!['unpaid', 'pending', 'paid', 'free', 'refunded', 'failed'].includes(paymentStatus)) {
      registrationData.paymentStatus = 'unpaid'; // Default to 'unpaid' if invalid value
    }
    
    // Prepare data for Supabase
    const dataForDb = {
      tournament_id: registrationData.tournamentId,
      user_id: registrationData.userId,
      team_name: registrationData.teamName,
      team_members: registrationData.teamMembers || [],
      captain: registrationData.captain || {},
      contact_info: registrationData.contactInfo || {},
      status: registrationData.status || 'pending',
      payment_status: paymentStatus,
      payment_method: registrationData.paymentMethod || 'none',
      transaction_id: registrationData.transactionId || '',
      agreed_to_terms: registrationData.agreedToTerms || false,
      registration_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    
    console.log('Processed registration data for Supabase:', dataForDb);
    
    const { data, error } = await supabase
      .from(registrationsTable)
      .insert([dataForDb])
      .select();
    
    if (error) {
      console.error('Error creating registration:', error);
      throw error;
    }
    
    // Update tournament's current_teams count
    try {
      await supabase.rpc('increment_tournament_teams', { 
        tournament_id: dataForDb.tournament_id 
      });
    } catch (rpcError) {
      console.error('Failed to increment tournament team count:', rpcError);
      // Continue even if this fails - registration still successful
    }
    
    return data && data.length > 0 ? convertToCamelCase(data[0]) : null;
  } catch (error) {
    console.error('Exception when creating registration:', error);
    throw error;
  }
}

/**
 * Update a registration
 */
export async function updateRegistration(registrationId: string, updateData: any) {
  try {
    const snakeCaseData = convertToSnakeCase(updateData);
    
    const { data, error } = await supabase
      .from(registrationsTable)
      .update(snakeCaseData)
      .eq('id', registrationId)
      .select();
    
    if (error) {
      console.error('Error updating registration:', error);
      throw error;
    }
    
    return data && data.length > 0 ? convertToCamelCase(data[0]) : null;
  } catch (error) {
    console.error('Exception when updating registration:', error);
    throw error;
  }
}

/**
 * Delete a registration
 */
export async function deleteRegistration(registrationId: string) {
  try {
    const { error } = await supabase
      .from(registrationsTable)
      .delete()
      .eq('id', registrationId);
    
    if (error) {
      console.error('Error deleting registration:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Exception when deleting registration:', error);
    throw error;
  }
}

/**
 * Get team members for a tournament (for displaying registered teams)
 */
export async function getTeamsByTournament(tournamentId: string) {
  try {
    const { data, error } = await supabase
      .from(registrationsTable)
      .select('id, team_name, captain, team_members, status')
      .eq('tournament_id', tournamentId)
      .eq('status', 'approved');
    
    if (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
    
    return data ? data.map(item => convertToCamelCase(item)) : [];
  } catch (error) {
    console.error('Exception when fetching teams:', error);
    return [];
  }
}

/**
 * Update a registration status
 */
export async function updateRegistrationStatus(registrationId: string, status: 'pending' | 'approved' | 'rejected') {
  try {
    const { data, error } = await supabase
      .from(registrationsTable)
      .update({ status })
      .eq('id', registrationId)
      .select();
      
    if (error) throw error;
    
    return data ? convertToCamelCase(data[0]) : null;
  } catch (error) {
    console.error('Error updating registration status:', error);
    throw error;
  }
}

/**
 * Update payment information
 */
export async function updatePaymentInfo(
  registrationId: string, 
  paymentData: { paymentStatus: string, transactionId?: string }
) {
  try {
    const snakeCaseData = convertToSnakeCase(paymentData);
    
    const { data, error } = await supabase
      .from(registrationsTable)
      .update(snakeCaseData)
      .eq('id', registrationId)
      .select();
      
    if (error) throw error;
    
    return data && data.length > 0 ? convertToCamelCase(data[0]) : null;
  } catch (error) {
    console.error('Error updating payment info:', error);
    throw error;
  }
} 