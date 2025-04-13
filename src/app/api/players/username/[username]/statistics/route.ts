import { NextRequest, NextResponse } from 'next/server';
import { getPlayerByUsername } from '@/lib/supabase-players';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const player = await getPlayerByUsername(params.username);
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const game = searchParams.get('game') || 'valorant';
    
    // For now, generate mock statistics since we don't have actual stats in Supabase yet
    const mockStats = generateMockStats(player.username, game);
    
    return NextResponse.json(mockStats);
  } catch (error) {
    console.error('Error fetching player statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player statistics', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Function to generate mock statistics for demo purposes
function generateMockStats(username: string, game: string) {
  const agents = game === 'valorant' 
    ? ['Jett', 'Reyna', 'Phoenix', 'Raze', 'Sova'] 
    : ['Tracer', 'Genji', 'Soldier:76', 'McCree', 'Mercy'];
  
  const maps = game === 'valorant'
    ? ['Ascent', 'Bind', 'Haven', 'Split', 'Icebox']
    : ['Hanamura', 'King\'s Row', 'Ilios', 'Dorado', 'Eichenwalde'];
  
  const mostPlayedAgent = agents[Math.floor(Math.random() * agents.length)];
  
  // Generate 10 recent matches
  const recentMatches = Array(10).fill(0).map((_, i) => {
    const kills = 10 + Math.floor(Math.random() * 20);
    const deaths = 5 + Math.floor(Math.random() * 10);
    const assists = 3 + Math.floor(Math.random() * 7);
    const map = maps[Math.floor(Math.random() * maps.length)];
    const result = Math.random() > 0.5 ? 'win' : 'loss';
    const team1Score = result === 'win' ? 13 : 5 + Math.floor(Math.random() * 8);
    const team2Score = result === 'win' ? 5 + Math.floor(Math.random() * 8) : 13;
    
    return {
      id: `match-${i}`,
      date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
      map,
      mode: 'Competitive',
      result,
      score: `${team1Score}-${team2Score}`,
      stats: {
        kills,
        deaths,
        assists,
        acs: Math.round((kills * 200 + assists * 50) / (team1Score + team2Score)),
        agent: agents[Math.floor(Math.random() * agents.length)]
      }
    };
  });
  
  // Generate win history for past 6 months
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const winHistory = Array(6).fill(0).map((_, i) => {
    const monthIndex = (currentMonth - i + 12) % 12;
    return {
      month: monthNames[monthIndex],
      winRate: 40 + Math.floor(Math.random() * 40) // Random between 40-80%
    };
  }).reverse();
  
  // Generate agent stats
  const agentStats = agents.map(agent => ({
    agent,
    matches: 10 + Math.floor(Math.random() * 40),
    winRate: 40 + Math.floor(Math.random() * 40),
    kd: (1 + Math.random() * 2).toFixed(2),
    averageScore: 200 + Math.floor(Math.random() * 100)
  }));
  
  return {
    username,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    mainGame: game,
    isPremium: Math.random() > 0.7,
    gameStats: {
      rank: game === 'valorant' ? 'Diamond 2' : 'Platinum',
      winRate: 50 + Math.floor(Math.random() * 20),
      kda: (2 + Math.random() * 1.5).toFixed(2),
      headshotPercentage: 20 + Math.floor(Math.random() * 30),
      averageScore: 220 + Math.floor(Math.random() * 100),
      mostPlayedAgent,
      avgKills: 14 + Math.floor(Math.random() * 8),
      avgDeaths: 6 + Math.floor(Math.random() * 6),
      avgAssists: 4 + Math.floor(Math.random() * 6),
      totalMatches: 120 + Math.floor(Math.random() * 200)
    },
    recentMatches,
    agentStats,
    winHistory
  };
} 