import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getUserTournamentRegistrations } from '@/lib/getUserRegistrations'; 
import { TournamentRegistration } from '@/types/registration';

/**
 * GET debug profile info
 * Returns the current user's session and registration data
 */
export async function GET(req: NextRequest) {
  try {
    // Get the user from the session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        message: 'You must be logged in to use this endpoint'
      }, { status: 401 });
    }
    
    // User is authenticated, get their auth details
    const userId = session.user.id;
    const userEmail = session.user.email;
    const username = session.user.name || userId;
    
    console.log(`Debug Profile API - User ID: ${userId}, Email: ${userEmail}, Username: ${username}`);
    
    // Get full tournament registrations with tournament data
    let registrations: TournamentRegistration[] = [];
    try {
      if (userId) {
        registrations = await getUserTournamentRegistrations(userId);
        console.log(`Debug Profile API - Found ${registrations.length} registrations for user ID`);
      }
    } catch (regError) {
      console.error('Error getting tournament registrations:', regError);
    }
    
    // Look for registrations with the user's ID (basic version)
    const { data: idRegistrations, error: idError } = await supabase
      .from('registrations')
      .select(`
        *,
        tournament:tournaments(*)
      `)
      .eq('user_id', userId);
      
    // Look for registrations with the user's email if email exists
    const { data: emailRegistrations, error: emailError } = userEmail ? 
      await supabase
        .from('registrations')
        .select(`
          *,
          tournament:tournaments(*)
        `)
        .eq('user_id', userEmail) : 
      { data: null, error: null };
    
    // Return all the collected data
    return NextResponse.json({
      sessionUser: {
        id: userId,
        email: userEmail,
        username: username
      },
      registrations: registrations, // Include the full tournament registrations
      idRegistrations: {
        count: idRegistrations?.length || 0,
        registrations: idRegistrations || [],
        error: idError ? idError.message : null
      },
      emailRegistrations: {
        count: emailRegistrations?.length || 0,
        registrations: emailRegistrations || [],
        error: emailError ? emailError.message : null
      }
    });
    
  } catch (error: any) {
    console.error('Error in debug profile API:', error);
    return NextResponse.json({ 
      error: 'Error fetching profile debug info', 
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
