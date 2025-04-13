import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET to check if a username is available
 * ?username=desired_username
 */
export async function GET(req: NextRequest) {
  try {
    // Get the username from query parameters
    const url = new URL(req.url);
    const username = url.searchParams.get('username');
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      );
    }
    
    // Check if the username already exists in the player_profiles table
    const { data, error, count } = await supabase
      .from('player_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('username', username);
    
    if (error) {
      console.error('Error checking username:', error);
      return NextResponse.json(
        { error: 'Failed to check username availability' },
        { status: 500 }
      );
    }
    
    // Return whether the username is available (true if no matches found)
    return NextResponse.json({ available: count === 0 });
  } catch (error) {
    console.error('Error in username check endpoint:', error);
    return NextResponse.json(
      { error: 'Server error checking username' },
      { status: 500 }
    );
  }
} 