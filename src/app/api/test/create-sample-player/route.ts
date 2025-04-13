import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Player from '@/lib/models/player';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Parse request body to get username or generate a default
    const { username = 'testplayer' + Math.floor(Math.random() * 1000) } = await req.json();
    
    // Check if player already exists
    const existingPlayer = await Player.findOne({ username });
    if (existingPlayer) {
      return NextResponse.json(
        { error: 'Player with this username already exists', player: existingPlayer },
        { status: 409 }
      );
    }
    
    // Create sample valorant matches
    const valorantMatches = [];
    const maps = ['Ascent', 'Haven', 'Split', 'Bind', 'Icebox', 'Breeze', 'Fracture'];
    const agents = ['Jett', 'Reyna', 'Sage', 'Killjoy', 'Omen', 'Phoenix', 'Sova', 'Chamber'];
    const agentClasses = {
      'Jett': 'duelist',
      'Reyna': 'duelist',
      'Phoenix': 'duelist',
      'Sage': 'sentinel',
      'Killjoy': 'sentinel',
      'Chamber': 'sentinel',
      'Omen': 'controller',
      'Sova': 'initiator'
    };
    
    // Generate 20 sample matches
    for (let i = 0; i < 20; i++) {
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const map = maps[Math.floor(Math.random() * maps.length)];
      const result = Math.random() > 0.4 ? 'win' : 'loss'; // 60% win rate
      const kills = Math.floor(Math.random() * 20) + 5; // 5-25 kills
      const deaths = Math.floor(Math.random() * 15) + 3; // 3-18 deaths
      const assists = Math.floor(Math.random() * 10) + 1; // 1-11 assists
      
      // Generate match date, more recent for earlier entries
      const date = new Date();
      date.setDate(date.getDate() - i * 2); // Every 2 days
      
      // Generate score based on result
      let score;
      if (result === 'win') {
        score = `13-${Math.floor(Math.random() * 11)}`;
      } else {
        score = `${Math.floor(Math.random() * 11)}-13`;
      }
      
      valorantMatches.push({
        map,
        agent,
        result,
        score,
        kills,
        deaths,
        assists,
        date
      });
    }
    
    // Generate agent stats
    const agentStats = [];
    const agentMatches = {};
    const agentWins = {};
    
    // Count matches and wins per agent
    valorantMatches.forEach(match => {
      if (!agentMatches[match.agent]) {
        agentMatches[match.agent] = 0;
        agentWins[match.agent] = 0;
      }
      
      agentMatches[match.agent]++;
      if (match.result === 'win') {
        agentWins[match.agent]++;
      }
    });
    
    // Calculate win rates and create agent stats
    Object.keys(agentMatches).forEach(agent => {
      const matches = agentMatches[agent];
      const wins = agentWins[agent];
      const winRate = Math.round((wins / matches) * 100);
      
      // Calculate average KDA
      const agentMatchStats = valorantMatches.filter(m => m.agent === agent);
      const totalKills = agentMatchStats.reduce((sum, m) => sum + m.kills, 0);
      const totalDeaths = agentMatchStats.reduce((sum, m) => sum + m.deaths, 0);
      const totalAssists = agentMatchStats.reduce((sum, m) => sum + m.assists, 0);
      
      const averageKDA = parseFloat(((totalKills + totalAssists) / (totalDeaths || 1)).toFixed(2));
      
      agentStats.push({
        agent,
        class: agentClasses[agent] || 'unknown',
        matches,
        winRate,
        averageKDA
      });
    });
    
    // Generate win history for chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const winHistory = months.map((month, index) => {
      // Start at ~50% and gradually improve to current win rate
      const baseWinRate = 50;
      const finalWinRate = 60; // Matches valorant win rate (60%)
      const progress = index / (months.length - 1);
      const winRate = Math.round(baseWinRate + (finalWinRate - baseWinRate) * progress);
      
      return { month, winRate };
    });
    
    // Calculate overall valorant stats
    const totalMatches = valorantMatches.length;
    const totalWins = valorantMatches.filter(m => m.result === 'win').length;
    const winRate = Math.round((totalWins / totalMatches) * 100);
    
    const totalKills = valorantMatches.reduce((sum, m) => sum + m.kills, 0);
    const totalDeaths = valorantMatches.reduce((sum, m) => sum + m.deaths, 0);
    const totalAssists = valorantMatches.reduce((sum, m) => sum + m.assists, 0);
    
    const kda = parseFloat(((totalKills + totalAssists) / (totalDeaths || 1)).toFixed(2));
    const headshotPercentage = Math.floor(Math.random() * 15) + 25; // 25-40%
    const averageScore = Math.floor(Math.random() * 100) + 200; // 200-300
    
    // Create the player
    const playerData = {
      username,
      email: `${username}@example.com`,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      mainGame: 'valorant',
      stats: {
        valorant: {
          rank: 'Diamond 2',
          winRate,
          kda,
          headshotPercentage,
          averageScore,
          matches: valorantMatches,
          agentStats
        }
      },
      profileImage: '/images/default-avatar.png',
      isPremium: false,
      winHistory
    };
    
    const player = new Player(playerData);
    await player.save();
    
    return NextResponse.json(
      { message: 'Sample player created successfully', player },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating sample player:', error);
    return NextResponse.json(
      { error: 'Failed to create sample player' },
      { status: 500 }
    );
  }
} 