import { NextResponse } from 'next/server';
import { getPlayerByUsername } from '@/lib/supabase';

// Mock player data for development/testing
const mockPlayer = {
  username: "ShubhamGamer",
  fullName: "Shubham Sharma",
  avatar: "/images/avatars/player1.jpg",
  rank: "Diamond",
  totalMatches: 235,
  winRate: 58,
  mainGame: "Valorant",
  stats: {
    kills: 3450,
    deaths: 1980,
    assists: 1240,
    kd: 1.74,
    headshots: 38,
    accuracy: 42
  },
  recentMatches: [
    {
      id: 1,
      game: "Valorant",
      result: "win",
      score: "13-8",
      kda: "24/11/8",
      date: "2 hours ago"
    },
    {
      id: 2,
      game: "Valorant",
      result: "loss",
      score: "10-13",
      kda: "16/14/5",
      date: "5 hours ago"
    },
    {
      id: 3,
      game: "BGMI",
      result: "win",
      score: "1st place",
      kda: "8/1/3",
      date: "Yesterday"
    },
    {
      id: 4,
      game: "Valorant",
      result: "win",
      score: "13-7",
      kda: "18/12/6",
      date: "2 days ago"
    }
  ],
  achievements: [
    "Tournament Champion - Summer Valorant Series",
    "5 Win Streak",
    "Ace - Clutched 1v5 situation",
    "MVP - 10 matches"
  ],
  teams: [
    {
      name: "Phoenix Esports",
      role: "Team Captain",
      joined: "Jan 2023"
    },
    {
      name: "Valorant All-Stars",
      role: "Member",
      joined: "Nov 2022"
    }
  ]
};

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    
    // Attempt to get the real player from the database
    let player;
    try {
      player = await getPlayerByUsername(username);
    } catch (error) {
      console.error(`Error fetching player with username ${username}:`, error);
    }
    
    // If no player is found or there's an error, return mock data for development
    if (!player) {
      console.log(`No player found with username ${username}, returning mock data`);
      
      // Return custom mock data if username matches mock player
      if (username.toLowerCase() === mockPlayer.username.toLowerCase()) {
        return NextResponse.json(mockPlayer);
      }
      
      // For any other username, return mock data with the requested username
      const customMockPlayer = {
        ...mockPlayer,
        username: username,
        fullName: username,
      };
      
      return NextResponse.json(customMockPlayer);
    }
    
    // If player is found, transform it to match the expected format
    const formattedPlayer = {
      username: player.username,
      fullName: player.displayName || player.username,
      avatar: player.avatarUrl || "/images/avatars/default.jpg",
      rank: player.rank || "Beginner",
      totalMatches: player.totalMatches || 0,
      winRate: player.winRate || 0,
      mainGame: player.mainGame || "Valorant",
      stats: {
        kills: player.stats?.kills || 0,
        deaths: player.stats?.deaths || 0,
        assists: player.stats?.assists || 0,
        kd: player.stats?.kd || 0,
        headshots: player.stats?.headshots || 0,
        accuracy: player.stats?.accuracy || 0
      },
      recentMatches: player.recentMatches || mockPlayer.recentMatches,
      achievements: player.achievements || mockPlayer.achievements,
      teams: player.teams || mockPlayer.teams
    };
    
    return NextResponse.json(formattedPlayer);
  } catch (error) {
    console.error('Error in player API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player data' },
      { status: 500 }
    );
  }
} 