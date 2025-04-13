import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// Schema for tournament registration validation
const registrationSchema = z.object({
  tournamentId: z.string().uuid({
    message: "Tournament ID must be a valid UUID"
  }),
  teamName: z.string().min(3, {
    message: "Team name must be at least 3 characters"
  }),
  teamMembers: z.array(z.object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    role: z.string().optional(),
    gameId: z.string().optional()
  })).optional().default([]),
  notes: z.string().optional(),
  paymentDetails: z.object({}).passthrough().optional().default({})
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const result = registrationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({
        error: "Invalid registration data",
        details: result.error.format()
      }, { status: 400 });
    }
    
    const { tournamentId, teamName, teamMembers, notes, paymentDetails } = result.data;
    
    // Check if tournament exists and has space
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('id, current_teams, max_teams, registration_deadline')
      .eq('id', tournamentId)
      .single();
    
    if (tournamentError || !tournament) {
      return NextResponse.json({
        error: "Tournament not found",
        details: tournamentError?.message
      }, { status: 404 });
    }
    
    // Check if registration is still open
    if (new Date() > new Date(tournament.registration_deadline)) {
      return NextResponse.json({
        error: "Registration deadline has passed"
      }, { status: 400 });
    }
    
    // Check if tournament is full
    if (tournament.current_teams >= tournament.max_teams) {
      return NextResponse.json({
        error: "Tournament is full"
      }, { status: 400 });
    }
    
    // Check if team name is already registered for this tournament
    const { data: existingRegistration, error: registrationCheckError } = await supabase
      .from('tournament_registrations')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('team_name', teamName)
      .maybeSingle();
    
    if (existingRegistration) {
      return NextResponse.json({
        error: "Team name already registered for this tournament"
      }, { status: 409 });
    }
    
    // Get the user ID from the session
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({
        error: "Authentication required"
      }, { status: 401 });
    }
    
    // Create registration using RPC function
    const { data, error } = await supabase.rpc(
      'create_tournament_registration',
      {
        p_tournament_id: tournamentId,
        p_user_id: userId,
        p_team_name: teamName,
        p_team_members: teamMembers,
        p_payment_details: paymentDetails,
        p_notes: notes
      }
    );
    
    if (error) {
      console.error('Registration creation error:', error);
      return NextResponse.json({
        error: "Failed to create registration",
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      registrationId: data,
      message: "Tournament registration successful"
    });
  } catch (error) {
    console.error('Tournament registration error:', error);
    return NextResponse.json({
      error: "Failed to process registration",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const tournamentId = url.searchParams.get('tournamentId');
    
    if (!tournamentId) {
      return NextResponse.json({
        error: "Tournament ID is required"
      }, { status: 400 });
    }
    
    // Get the user ID from the session
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({
        error: "Authentication required"
      }, { status: 401 });
    }
    
    // Query registrations
    const query = supabase
      .from('tournament_registrations')
      .select('*');
    
    // If tournament ID is provided, filter by it
    if (tournamentId) {
      query.eq('tournament_id', tournamentId);
    }
    
    // Add user filter
    query.eq('user_id', userId);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching registrations:', error);
      return NextResponse.json({
        error: "Failed to fetch registrations",
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      registrations: data
    });
  } catch (error) {
    console.error('Error in GET registrations:', error);
    return NextResponse.json({
      error: "Failed to process request",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 