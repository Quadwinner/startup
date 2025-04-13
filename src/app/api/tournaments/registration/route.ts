import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { registerPlayerForTournament } from '@/lib/supabase';

/**
 * POST to register a user for a tournament
 */
export async function POST(req: NextRequest) {
  try {
    // Get the user from the session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const data = await req.json();
    
    // Validate required fields
    if (!data.tournamentId) {
      return NextResponse.json(
        { error: 'Tournament ID is required' },
        { status: 400 }
      );
    }
    
    // Get the user ID
    const userId = session.user.id;
    
    // Register the player for the tournament
    const registration = await registerPlayerForTournament(
      userId,
      data.tournamentId,
      {
        teamName: data.teamName || 'Individual Entry',
        teamMembers: data.teamMembers || [],
        notes: data.notes || '',
        status: 'pending'
      }
    );
    
    // Update the tournament's current_teams count
    // (This should ideally be handled by a trigger in the database)
    try {
      const { error: updateError } = await fetch(`/api/tournaments/${data.tournamentId}/update-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
      
      if (updateError) {
        console.error('Failed to update tournament count:', updateError);
      }
    } catch (countError) {
      console.error('Error updating tournament count:', countError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully registered for tournament',
      registration
    });
  } catch (error) {
    console.error('Error registering for tournament:', error);
    
    return NextResponse.json({
      error: 'Failed to register for tournament',
      details: error.message || 'An unknown error occurred'
    }, { status: 500 });
  }
}

/**
 * GET tournament registrations for the current user
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
    
    // This should be implemented in lib/supabase.ts
    // For now, we're using mock data
    const mockRegistrations = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: userId,
        tournamentId: '123e4567-e89b-12d3-a456-426614174001',
        tournamentName: 'EpicEsports Valorant Championship',
        game: 'Valorant',
        gameImage: '/images/valorant.jpg',
        startDate: '2025-05-15',
        teamName: 'Phoenix Rising',
        registrationStatus: 'approved',
        registeredAt: '2025-04-10T09:15:00Z'
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        userId: userId,
        tournamentId: '123e4567-e89b-12d3-a456-426614174003',
        tournamentName: 'BGMI Pro Series',
        game: 'BGMI',
        gameImage: '/images/bgmi.jpg',
        startDate: '2025-06-05',
        teamName: 'Elite Squad',
        registrationStatus: 'pending',
        registeredAt: '2025-04-11T14:30:00Z'
      }
    ];
    
    return NextResponse.json({ registrations: mockRegistrations });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch registrations',
      details: error.message || 'An unknown error occurred'
    }, { status: 500 });
  }
}
