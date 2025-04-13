import { NextRequest, NextResponse } from 'next/server';
import { seedTournaments } from '@/lib/supabase';

// Sample tournaments data for seeding
const sampleTournaments = [
  {
    name: "EpicEsports Valorant Championship",
    game: "valorant",
    gameImage: "/images/valorant.jpg",
    startDate: "2025-05-15",
    endDate: "2025-05-20",
    registrationDeadline: "2025-05-10",
    prizePool: "₹1,00,000",
    teamSize: 5,
    maxTeams: 16,
    currentTeams: 0,
    location: "Online",
    status: "upcoming",
    registrationFee: 500,
    format: "single-elimination",
    description: "Join India's premier Valorant tournament and compete against the best teams in the country.",
    rules: "Standard tournament rules apply. All players must have a valid Valorant account.",
    organizer: {
      name: "EpicEsports",
      verified: true,
      contact: "admin@epicesports.in"
    },
    prizes: [
      { position: 1, reward: "₹50,000" },
      { position: 2, reward: "₹25,000" },
      { position: 3, reward: "₹15,000" }
    ],
    schedule: [
      { stage: "Group Stage", date: "2025-05-15", details: "4 groups of 4 teams" },
      { stage: "Quarterfinals", date: "2025-05-18", details: "Top 2 teams from each group" },
      { stage: "Semifinals", date: "2025-05-19", details: "Best of 3 series" },
      { stage: "Finals", date: "2025-05-20", details: "Best of 5 series" }
    ]
  },
  {
    name: "Delhi Gaming Festival - BGMI Tournament",
    game: "bgmi",
    gameImage: "/images/bgmi.jpg",
    startDate: "2025-06-05",
    endDate: "2025-06-07",
    registrationDeadline: "2025-06-01",
    prizePool: "₹50,000",
    teamSize: 4,
    maxTeams: 20,
    currentTeams: 0,
    location: "Delhi, India",
    status: "upcoming",
    registrationFee: 300,
    format: "double-elimination",
    description: "The biggest BGMI tournament in Delhi with exciting prizes and professional casting.",
    rules: "Teams must arrive 1 hour before their scheduled matches. All players must have valid ID proof.",
    organizer: {
      name: "Delhi Gaming Association",
      verified: true,
      contact: "contact@delhigaming.org"
    },
    prizes: [
      { position: 1, reward: "₹25,000" },
      { position: 2, reward: "₹15,000" },
      { position: 3, reward: "₹10,000" }
    ],
    schedule: [
      { stage: "Day 1", date: "2025-06-05", details: "Preliminary rounds" },
      { stage: "Day 2", date: "2025-06-06", details: "Quarter and Semifinals" },
      { stage: "Day 3", date: "2025-06-07", details: "Finals and prize distribution" }
    ]
  }
];

// GET handler to seed tournaments
export async function GET(req: NextRequest) {
  try {
    const result = await seedTournaments(sampleTournaments);
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error seeding tournaments:', error);
    return NextResponse.json(
      { 
        error: 'Failed to seed tournaments', 
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 