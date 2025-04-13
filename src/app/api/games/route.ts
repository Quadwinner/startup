import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Fallback game data in case database connection fails
const fallbackGames = [
  {
    id: 1,
    name: 'Valorant',
    slug: 'valorant',
    image: '/images/valorant.jpg',
    description: 'A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities.',
    category: 'FPS',
    activeTournaments: 12,
    totalPlayers: 2450
  },
  {
    id: 2,
    name: 'BGMI',
    slug: 'bgmi',
    image: '/images/bgmi.jpg',
    description: 'Battlegrounds Mobile India is a battle royale game where players compete to be the last one standing.',
    category: 'Battle Royale',
    activeTournaments: 15,
    totalPlayers: 3800
  },
  {
    id: 3,
    name: 'Counter-Strike 2',
    slug: 'cs2',
    image: '/images/other-games.jpg',
    description: 'The next evolution of the world\'s most popular FPS, introducing new features and gameplay improvements.',
    category: 'FPS',
    activeTournaments: 8,
    totalPlayers: 1850
  },
  {
    id: 4,
    name: 'FIFA 24',
    slug: 'fifa24',
    image: '/images/other-games.jpg',
    description: 'The latest installment in the FIFA series, bringing realistic football simulation to esports.',
    category: 'Sports',
    activeTournaments: 5,
    totalPlayers: 1200
  },
  {
    id: 5,
    name: 'Dota 2',
    slug: 'dota2',
    image: '/images/other-games.jpg',
    description: 'A multiplayer online battle arena (MOBA) game with deep strategic gameplay and competitive scene.',
    category: 'MOBA',
    activeTournaments: 4,
    totalPlayers: 950
  },
  {
    id: 6,
    name: 'Apex Legends',
    slug: 'apex-legends',
    image: '/images/other-games.jpg',
    description: 'A free-to-play battle royale game where legendary competitors battle for glory and fortune.',
    category: 'Battle Royale',
    activeTournaments: 6,
    totalPlayers: 1650
  }
];

/**
 * GET games with optional category filter
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    
    // Query the games table in Supabase
    let query = supabase.from('games').select(`
      id,
      name,
      slug,
      image,
      description,
      category,
      featured,
      created_at,
      updated_at,
      tournaments:tournaments(count),
      players:player_games(count)
    `);
    
    // Apply filters if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    if (featured) {
      query = query.eq('featured', true);
    }
    
    // Execute the query
    const { data: games, error } = await query;
    
    if (error) {
      console.error('Error fetching games from Supabase:', error);
      throw error;
    }
    
    // Format the results
    const formattedGames = games?.map(game => ({
      id: game.id,
      name: game.name,
      slug: game.slug,
      image: game.image || `/images/games/${game.slug}.jpg`,
      description: game.description,
      category: game.category,
      activeTournaments: game.tournaments?.[0]?.count || 0,
      totalPlayers: game.players?.[0]?.count || 0
    })) || [];
    
    return NextResponse.json({ games: formattedGames });
  } catch (error) {
    console.error('Error in Games API route:', error);
    
    // Return fallback data with a message
    return NextResponse.json({
      games: fallbackGames,
      isFallback: true,
      message: 'Error connecting to database, showing sample data'
    }, { status: 200 });
  }
}

/**
 * POST to create a new game
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const gameData = await req.json();
    
    // Basic validation
    if (!gameData.name || !gameData.slug || !gameData.category) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, slug, and category are required' 
      }, { status: 400 });
    }
    
    // Create game in Supabase
    const { data, error } = await supabase.from('games').insert([{
      name: gameData.name,
      slug: gameData.slug,
      image: gameData.image || null,
      description: gameData.description || null,
      category: gameData.category,
      featured: gameData.featured || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]).select();
    
    if (error) {
      console.error('Error creating game in Supabase:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json({ 
          error: 'A game with this name or slug already exists' 
        }, { status: 400 });
      }
      
      throw error;
    }
    
    return NextResponse.json({ 
      message: 'Game created successfully', 
      game: data?.[0] 
    }, { status: 201 });
  } catch (error) {
    console.error('Error in Games API POST route:', error);
    
    return NextResponse.json({ 
      error: 'Failed to create game. Please try again later.',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
