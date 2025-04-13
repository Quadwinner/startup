import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

/**
 * GET player tournament history
 * Returns the tournament history of the current authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    // Get the user from the session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }
    
    // Get tournament registrations directly from the database
    try {
      // Direct query to the registrations table with user ID
      const { data: registrations, error } = await supabase
        .from('registrations')
        .select(`
          *,
          tournament:tournaments (*)
        `)
        .eq('user_id', userId);
      
      // If error, log it and return empty array
      if (error) {
        console.error('Error fetching registrations:', error);
        return NextResponse.json({ history: [] });
      }
      
      // If no registrations found, return empty array
      if (!registrations || registrations.length === 0) {
        return NextResponse.json({ history: [] });
      }
      
      // Transform the registrations to the expected format
      const formattedHistory = registrations.map(reg => ({
        registrationId: reg.id,
        tournamentId: reg.tournament_id,
        tournamentName: reg.tournament?.name || `Tournament ${reg.tournament_id.substring(0, 8)}`,
        game: reg.tournament?.game || 'Game',
        startDate: reg.tournament?.start_date || reg.registration_date,
        teamName: reg.team_name || 'Individual',
        registrationStatus: reg.status || 'pending',
        paymentStatus: reg.payment_status || 'pending',
        registrationDate: reg.registration_date || reg.created_at || new Date().toISOString()
      }));
      
      console.log('Found and formatted registrations:', formattedHistory);
      return NextResponse.json({ history: formattedHistory });
    } catch (dbError) {
      console.error('Database error when fetching tournament history:', dbError);
      return NextResponse.json({ 
        history: [], 
        error: 'Error fetching tournament history' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching tournament history:', error);
    return NextResponse.json({ 
      history: [], 
      error: 'Error fetching tournament history' 
    }, { status: 500 });
  }
}