import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createPlayer, getPlayers, getPlayerByUsername } from '@/lib/supabase-players';
import { supabase } from '@/lib/supabase';

// Schema for player validation
const playerSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters"
  }),
  displayName: z.string().optional(),
  mainGame: z.string().optional(),
  email: z.string().email().optional(),
  profileImage: z.string().url().optional(),
  winRate: z.number().default(0),
  totalMatches: z.number().default(0),
  wins: z.number().default(0),
  losses: z.number().default(0),
  bio: z.string().optional(),
  location: z.string().optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url()
  })).optional().default([])
});

// Helper functions to convert between camelCase and snake_case
function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) => 
    group.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function transformKeys(obj: any, transformer: (key: string) => string): any {
  if (Array.isArray(obj)) {
    return obj.map(item => transformKeys(item, transformer));
  }
  
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const value = obj[key];
      const transformedKey = transformer(key);
      result[transformedKey] = transformKeys(value, transformer);
      return result;
    }, {} as Record<string, any>);
  }
  
  return obj;
}

function toSnakeCaseKeys(obj: any): any {
  return transformKeys(obj, toSnakeCase);
}

function toCamelCaseKeys(obj: any): any {
  return transformKeys(obj, toCamelCase);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const result = playerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({
        error: "Invalid player data",
        details: result.error.format()
      }, { status: 400 });
    }
    
    // Check if player with same username already exists
    const existingPlayer = await getPlayerByUsername(result.data.username);
    
    if (existingPlayer) {
      return NextResponse.json(
        { error: 'Player with this username already exists' },
        { status: 409 }
      );
    }
    
    // Get the user ID from the session if available
    let userId = null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        userId = session.user.id;
      }
    } catch (authError) {
      console.error('Authentication error:', authError);
      // Continue without user_id if auth fails
    }
    
    // Add user ID if available
    const playerData = {
      ...result.data,
      userId: userId
    };
    
    // Create a new player
    const player = await createPlayer(playerData);
    
    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Failed to create player', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const game = searchParams.get('game');
    const username = searchParams.get('username');
    
    const result = await getPlayers({
      mainGame: game || null,
      username: username || null,
      sortBy: 'winRate',
      sortOrder: 'desc',
      page,
      limit
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 