import { NextRequest, NextResponse } from 'next/server';
import { getTournaments, createTournament } from '@/lib/supabase';

// Sample fallback data for when database fails
const fallbackTournaments = [
  {
    id: 1,
    name: "EpicEsports Valorant Championship",
    game: "Valorant",
    gameImage: "/images/valorant.jpg",
    startDate: "2023-05-15",
    endDate: "2023-05-20",
    registrationDeadline: "2023-05-10",
    prizePool: "₹1,00,000",
    teamSize: 5,
    maxTeams: 16,
    currentTeams: 14,
    location: "Online",
    status: "upcoming",
    organizer: {
      name: "EpicEsports",
      verified: true
    }
  },
  {
    id: 2,
    name: "Delhi Gaming Festival - BGMI Tournament",
    game: "BGMI",
    gameImage: "/images/bgmi.jpg",
    startDate: "2023-06-05",
    endDate: "2023-06-07",
    registrationDeadline: "2023-06-01",
    prizePool: "₹50,000",
    teamSize: 4,
    maxTeams: 20,
    currentTeams: 18,
    location: "Delhi, India",
    status: "upcoming",
    organizer: {
      name: "Delhi Gaming Association",
      verified: true
    }
  }
];

// GET all tournaments with optional filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const game = searchParams.get('game');
    const status = searchParams.get('status');
    const teamSize = searchParams.get('teamSize');
    const sortBy = searchParams.get('sortBy') || 'startDate';
    const featured = searchParams.get('featured') === 'true';
    
    // Get tournaments from Supabase
    const tournaments = await getTournaments({
      game,
      status,
      teamSize,
      sortBy,
      featured
    });
    
    if (!tournaments || tournaments.length === 0) {
      // If no tournaments found in the database, return the fallback data
      console.log('No tournaments found in database, using fallback data');
      return NextResponse.json({ tournaments: fallbackTournaments, isFallback: true });
    }
    
    return NextResponse.json({ tournaments });
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    
    // Return fallback data with a 200 status to avoid breaking the client
    // but include isFallback: true to let the client know these are sample data
    return NextResponse.json({ 
      tournaments: fallbackTournaments, 
      isFallback: true,
      error: 'Database connection error, showing sample data' 
    }, { status: 200 });
  }
}

// POST to create a new tournament
export async function POST(req: NextRequest) {
  try {
    // Parse the request body first
    const tournamentData = await req.json();
    
    // Log the tournament data being created
    console.log('Creating tournament with data:', JSON.stringify(tournamentData, null, 2));
    
    // Create tournament in Supabase
    const tournament = await createTournament(tournamentData);
    
    console.log('Tournament created successfully:', tournament.id);
    
    return NextResponse.json(
      { message: 'Tournament created successfully', tournament },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating tournament:', error);
    
    // Handle Supabase specific errors
    if (error.code === '23505') { // Unique constraint error
      return NextResponse.json(
        { 
          error: 'A tournament with this name already exists', 
          details: 'Please use a different tournament name'
        },
        { status: 400 }
      );
    }
    
    if (error.code === '23502') { // Not null violation
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          details: error.message
        },
        { status: 400 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        error: 'Failed to create tournament. Please try again later.',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 