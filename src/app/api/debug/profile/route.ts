import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

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
    
    // Look for registrations with the user's ID
    const { data: idRegistrations, error: idError } = await supabase
      .from('registrations')
      .select('id, tournament_id, user_id, team_name, status')
      .eq('user_id', userId);
      
    // Look for registrations with the user's email
    const { data: emailRegistrations, error: emailError } = userEmail ? 
      await supabase
        .from('registrations')
        .select('id, tournament_id, user_id, team_name, status')
        .eq('user_id', userEmail) : 
      { data: null, error: null };
    
    // Return all the collected data
    return NextResponse.json({
      sessionUser: {
        id: userId,
        email: userEmail
      },
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
    return NextResponse.json({ 
      error: 'Error fetching profile debug info', 
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
