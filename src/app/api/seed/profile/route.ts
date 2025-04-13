import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createOrUpdateUserProfile } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

/**
 * POST to seed profile and member stats data
 * Only works in development
 */
export async function POST() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }
    
    // Get the user from the session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Generate a sample user profile
    const profile = {
      userId: userId,
      username: session.user.name?.replace(/\s+/g, '') || `gamer${Math.floor(Math.random() * 10000)}`,
      displayName: session.user.name || 'Epic Gamer',
      email: session.user.email || 'user@example.com',
      bio: 'I am a competitive gamer who loves to participate in tournaments.',
      experienceLevel: 'intermediate',
      mainGame: 'Valorant',
      secondaryGames: ['BGMI', 'Apex Legends'],
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      socialLinks: JSON.stringify({
        instagram: 'epicgamer',
        twitter: 'epicgamer',
        discord: 'epicgamer#1234'
      })
    };
    
    // Create or update the user profile
    const createdProfile = await createOrUpdateUserProfile(userId, profile);
    
    // Generate sample member stats
    const memberStats = {
      user_id: userId,
      total_tournaments: 15,
      tournaments_won: 3,
      total_matches: 67,
      matches_won: 42,
      win_rate: 62.69,
      favorite_game: 'Valorant',
      total_kills: 1250,
      total_deaths: 780,
      total_assists: 467,
      kd_ratio: 1.6,
      achievements: JSON.stringify([
        { title: 'First Win', description: 'Won your first tournament', awarded_at: new Date().toISOString() },
        { title: 'Team Captain', description: 'Created and led a team in competition', awarded_at: new Date().toISOString() },
        { title: 'Perfect Score', description: 'Won a match without losing a round', awarded_at: new Date().toISOString() }
      ]),
      badges: JSON.stringify([
        { name: 'Early Adopter', icon: 'stars' },
        { name: 'MVP', icon: 'trophy' }
      ]),
      statistics: JSON.stringify({
        valorant: {
          kills: 850,
          deaths: 450,
          assists: 320,
          headshot_percentage: 38,
          most_played_agent: 'Jett'
        },
        bgmi: {
          kills: 400,
          deaths: 330,
          assists: 147,
          damage_dealt: 78500
        }
      })
    };
    
    // Insert or update member stats
    const { data: statsData, error: statsError } = await supabase
      .from('member_stats')
      .upsert(memberStats)
      .select();
    
    if (statsError) {
      console.error('Error seeding member stats:', statsError);
    }
    
    // Generate sample tournament registrations
    const tournaments = await supabase
      .from('tournaments')
      .select('id, name')
      .limit(3);
    
    if (tournaments.error) {
      console.error('Error fetching tournaments for seed data:', tournaments.error);
    }
    
    let registrationsData = [];
    
    if (tournaments.data && tournaments.data.length > 0) {
      const registrations = tournaments.data.map((tournament, index) => ({
        tournament_id: tournament.id,
        user_id: userId,
        team_name: ['Phoenix Rising', 'Elite Squad', 'Fire Dragons'][index % 3],
        team_members: JSON.stringify([
          { name: 'Player 1', role: 'Captain', email: 'player1@example.com' },
          { name: 'Player 2', role: 'Member', email: 'player2@example.com' },
          { name: 'Player 3', role: 'Member', email: 'player3@example.com' }
        ]),
        captain_info: JSON.stringify({
          name: session.user.name || 'Captain',
          phone: '1234567890',
          discord: 'captain#1234'
        }),
        status: ['pending', 'approved', 'completed'][index % 3],
        payment_status: ['pending', 'paid', 'paid'][index % 3]
      }));
      
      // Insert tournament registrations (skip if already exists due to unique constraint)
      const { data: regData, error: regError } = await supabase
        .from('tournaments_registrations')
        .upsert(registrations, { onConflict: 'user_id,tournament_id' })
        .select();
      
      if (regError) {
        console.error('Error seeding tournament registrations:', regError);
      } else {
        registrationsData = regData;
      }
    }
    
    return NextResponse.json({
      message: 'Profile and member data seeded successfully',
      profile: createdProfile,
      stats: statsData ? statsData[0] : null,
      registrations: registrationsData
    });
  } catch (error) {
    console.error('Error seeding profile data:', error);
    return NextResponse.json(
      { error: 'Failed to seed profile data' },
      { status: 500 }
    );
  }
} 