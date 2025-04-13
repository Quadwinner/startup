import { NextRequest, NextResponse } from 'next/server';
import { getTournamentById, supabase } from '@/lib/supabase';

// Fallback tournament data for when ID is invalid or tournament not found
const fallbackTournament = {
  _id: "sample123456789",
  name: "Sample Tournament",
  game: "Valorant",
  gameImage: "/images/valorant.jpg",
  startDate: "2023-07-15",
  endDate: "2023-07-20",
  registrationDeadline: "2023-07-10",
  prizePool: "₹50,000",
  teamSize: 5,
  maxTeams: 16,
  currentTeams: 8,
  location: "Online",
  status: 'upcoming',
  organizer: {
    name: "EpicEsports",
    verified: true,
    contact: "organizers@epicesports.in"
  },
  description: "This is a sample tournament. The actual tournament data could not be loaded.",
  rules: "- Standard tournament rules apply\n- All players must follow the code of conduct",
  prizes: [
    { position: 1, reward: "₹25,000" },
    { position: 2, reward: "₹15,000" },
    { position: 3, reward: "₹10,000" }
  ],
  schedule: [
    { stage: "Group Stage", date: "2023-07-15", details: "4 groups of 4 teams" },
    { stage: "Quarterfinals", date: "2023-07-18", details: "Top 2 teams from each group" },
    { stage: "Semifinals", date: "2023-07-19", details: "Best of 3 series" },
    { stage: "Finals", date: "2023-07-20", details: "Best of 5 series" }
  ],
  registrationFee: 500
};

// GET a single tournament by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Check if id is valid (Supabase uses UUIDs)
    if (!id || id.length < 5) {
      console.warn(`Invalid tournament ID format: ${id}`);
      // Return fallback data with a 200 status but indicate it's fallback data
      return NextResponse.json({
        tournament: fallbackTournament,
        isFallback: true,
        error: 'Invalid tournament ID format'
      }, { status: 200 });
    }
    
    // Get tournament from Supabase
    const tournament = await getTournamentById(id);
    
    if (!tournament) {
      console.warn(`Tournament not found with ID: ${id}`);
      // Return fallback data with a 200 status but indicate it's fallback data
      return NextResponse.json({
        tournament: fallbackTournament,
        isFallback: true,
        error: 'Tournament not found'
      }, { status: 200 });
    }
    
    return NextResponse.json({ tournament });
  } catch (error) {
    console.error('Error fetching tournament:', error);
    // Return fallback data with a 200 status but indicate it's fallback data and there was an error
    return NextResponse.json({
      tournament: fallbackTournament,
      isFallback: true,
      error: 'Failed to fetch tournament data'
    }, { status: 200 });
  }
}

// PUT to update a tournament
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    
    // Check if id is valid
    if (!id || id.length < 5) {
      return NextResponse.json(
        { error: 'Invalid tournament ID' },
        { status: 400 }
      );
    }
    
    // Update tournament in Supabase
    const { data, error } = await supabase
      .from('tournaments')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ tournament: data });
  } catch (error) {
    console.error('Error updating tournament:', error);
    return NextResponse.json(
      { error: 'Failed to update tournament', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE a tournament
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Check if id is valid
    if (!id || id.length < 5) {
      return NextResponse.json(
        { error: 'Invalid tournament ID' },
        { status: 400 }
      );
    }
    
    // Delete tournament from Supabase
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    return NextResponse.json(
      { error: 'Failed to delete tournament', details: error.message },
      { status: 500 }
    );
  }
} 