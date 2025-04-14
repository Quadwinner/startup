import { NextRequest, NextResponse } from 'next/server';
import { getPlayerById, updatePlayer, deletePlayer, getPlayerByUsername } from '@/lib/supabase-players';
import { z } from 'zod';
import { validate as isUUID } from 'uuid';

// Schema for player update validation
const playerUpdateSchema = z.object({
  displayName: z.string().optional(),
  mainGame: z.string().optional(),
  email: z.string().email().optional(),
  profileImage: z.string().url().optional(),
  winRate: z.number().optional(),
  totalMatches: z.number().optional(),
  wins: z.number().optional(),
  losses: z.number().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url()
  })).optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the player identifier from params
    const playerId = params.id;
    let player;

    // Check if the identifier is a UUID or a username
    if (isUUID(playerId)) {
      // If it's a UUID, fetch by ID
      player = await getPlayerById(playerId);
    } else {
      // If it's not a UUID, treat it as a username
      player = await getPlayerByUsername(playerId);
    }

    if (!player) {
      return NextResponse.json(
        { error: `Player with identifier ${playerId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ player });
  } catch (error) {
    console.error(`Failed to fetch player with identifier ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if player exists
    const existingPlayer = await getPlayerById(params.id);
    
    if (!existingPlayer) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }
    
    // Parse and validate the request body
    const body = await req.json();
    const result = playerUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({
        error: "Invalid player data",
        details: result.error.format()
      }, { status: 400 });
    }
    
    // Update the player
    const updatedPlayer = await updatePlayer(params.id, result.data);
    
    return NextResponse.json(updatedPlayer);
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { error: 'Failed to update player', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if player exists
    const existingPlayer = await getPlayerById(params.id);
    
    if (!existingPlayer) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }
    
    // Delete the player
    await deletePlayer(params.id);
    
    return NextResponse.json(
      { success: true, message: 'Player deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 