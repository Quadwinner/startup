import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTournaments } from '@/lib/supabase';

// Sample registration data
const generateSampleRegistrations = (tournamentId: string, userId: string = 'demo-user') => {
  return [
    {
      tournament_id: tournamentId,
      user_id: userId,
      team_name: 'Alpha Squad',
      team_members: [
        { name: 'Player Two', email: 'player2@example.com', gameId: 'Player2Gaming' },
        { name: 'Player Three', email: 'player3@example.com', gameId: 'Player3Pro' },
        { name: 'Player Four', email: 'player4@example.com', gameId: 'Player4Official' },
      ],
      captain: {
        name: 'Player One',
        email: 'player1@example.com',
        phone: '+919876543210',
        gameId: 'Player1Leader'
      },
      contact_info: {
        email: 'team@example.com',
        phone: '+919876543210'
      },
      status: 'pending',
      payment_status: 'unpaid',
      payment_method: 'upi',
      transaction_id: 'DEMO12345',
      agreed_to_terms: true,
      registration_date: new Date().toISOString()
    },
    {
      tournament_id: tournamentId,
      user_id: 'another-demo-user',
      team_name: 'Beta Warriors',
      team_members: [
        { name: 'Member Two', email: 'member2@example.com', gameId: 'Member2Gaming' },
        { name: 'Member Three', email: 'member3@example.com', gameId: 'Member3Pro' },
        { name: 'Member Four', email: 'member4@example.com', gameId: 'Member4Official' },
      ],
      captain: {
        name: 'Team Captain',
        email: 'captain@example.com',
        phone: '+919876543211',
        gameId: 'CaptainGaming'
      },
      contact_info: {
        email: 'team@example.com',
        phone: '+919876543211'
      },
      status: 'approved',
      payment_status: 'paid',
      payment_method: 'card',
      transaction_id: 'DEMO67890',
      agreed_to_terms: true,
      registration_date: new Date().toISOString()
    }
  ];
};

export async function GET(req: NextRequest) {
  try {
    // First check if we have tournaments
    const { tournaments } = await getTournaments({ limit: 2 });
    
    if (!tournaments || tournaments.length === 0) {
      return NextResponse.json({
        message: 'No tournaments found. Please seed tournaments first.',
        success: false
      }, { status: 400 });
    }
    
    // Check if registrations already exist
    const { count, error: countError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw countError;
    }
    
    // If registrations already exist, don't seed
    if (count && count > 0) {
      return NextResponse.json({
        message: `Database already contains ${count} registrations. No seeding needed.`,
        count,
        success: true
      });
    }
    
    // Generate sample registrations for the first tournament
    const tournamentId = tournaments[0].id;
    const sampleRegistrations = generateSampleRegistrations(tournamentId);
    
    // Insert sample registrations
    const { data, error } = await supabase
      .from('registrations')
      .insert(sampleRegistrations)
      .select();
    
    if (error) {
      console.error('Error seeding registrations:', error);
      throw error;
    }
    
    // Update the tournament's current_teams count
    try {
      await supabase.rpc('increment_tournament_teams', { tournament_id: tournamentId });
      // Do it twice for two teams
      await supabase.rpc('increment_tournament_teams', { tournament_id: tournamentId });
    } catch (rpcError) {
      console.error('Error updating tournament team count:', rpcError);
    }
    
    return NextResponse.json({
      message: `Successfully seeded ${data.length} registrations`,
      count: data.length,
      registrations: data,
      success: true
    });
  } catch (error) {
    console.error('Failed to seed registrations:', error);
    return NextResponse.json({
      message: 'Failed to seed registrations',
      error: error instanceof Error ? error.message : String(error),
      success: false
    }, { status: 500 });
  }
} 