import { NextRequest, NextResponse } from 'next/server';
import { createProfile, getProfileByUserId, updateProfile } from '@/lib/supabase-profiles';
import { getUserProfileById, getMemberStats, getUserTournamentRegistrations } from '@/lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Mock profile data for fallback when database fails
const mockProfile = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  userId: '123e4567-e89b-12d3-a456-426614174001',
  username: 'gamerdemo',
  displayName: 'Pro Gamer',
  email: 'demo@epicesports.com',
  bio: 'Competitive gamer with a passion for esports.',
  experienceLevel: 'advanced',
  mainGame: 'Valorant',
  country: 'India',
  state: 'Maharashtra',
  city: 'Mumbai',
  avatarUrl: null,
  bannerUrl: null,
  createdAt: '2023-12-01T00:00:00.000Z',
  updatedAt: '2023-12-01T00:00:00.000Z',
  totalTournaments: 12,
  tournamentsWon: 3,
  totalMatches: 54,
  matchesWon: 32,
  achievements: [
    { title: 'First Win', description: 'Won your first tournament' },
    { title: 'Team Captain', description: 'Created and led a team in competition' },
    { title: 'Perfect Score', description: 'Won a match without losing a round' }
  ]
};

/**
 * GET player profile
 * Returns the profile of the current authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    // Get the user from the session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Try to get real profile data from database
    try {
      // First try to get user profile
      const profile = await getUserProfileById(userId);
      
      // If profile exists, get additional data
      if (profile) {
        // Try to get member stats (games played, wins, etc)
        const memberStats = await getMemberStats(userId);
        
        // Try to get tournament registrations to count total tournaments
        const registrations = await getUserTournamentRegistrations(userId);
        
        // Combine all data for a complete profile
        const completeProfile = {
          ...profile,
          totalTournaments: registrations?.length || 0,
          tournamentsWon: memberStats?.tournamentsWon || 0,
          totalMatches: memberStats?.totalMatches || 0,
          matchesWon: memberStats?.matchesWon || 0,
          achievements: memberStats?.achievements || []
        };
        
        console.log('Fetched real profile data from database');
        return NextResponse.json({ profile: completeProfile });
      }
      
      // If no profile found, try the legacy method
      const legacyProfile = await getProfileByUserId(userId);
      
      if (legacyProfile) {
        console.log('Fetched legacy profile data');
        return NextResponse.json({ profile: legacyProfile });
      }
    } catch (dbError) {
      console.error('Database error when fetching profile:', dbError);
    }
    
    // If no profile found or error occurred, return mock data for development
    console.log('No profile found or database error, returning mock data for development');
    return NextResponse.json({ profile: mockProfile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    
    // Return mock data for development if there's an error
    console.log('Error fetching profile, returning mock data for development');
    return NextResponse.json({ profile: mockProfile });
  }
}

/**
 * POST to create or update player profile
 */
export async function POST(req: NextRequest) {
  try {
    // Get the user from the session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const profileData = await req.json();
    
    console.log('Creating/updating profile for user:', userId);
    console.log('Profile data:', JSON.stringify(profileData));

    // Validate if the user ID is in UUID format
    let formattedUserId = userId;
    
    try {
      // Dynamically import the uuid package
      const { validate: isValidUUID, v5: uuidv5 } = await import('uuid');
      
      // If the user ID is not a valid UUID (likely from a different auth provider like MongoDB)
      // We need to generate a valid UUID for Supabase
      if (!isValidUUID(userId)) {
        console.log('User ID is not in UUID format, generating UUID...');
        // Generate a deterministic UUID v5 using the user ID as namespace
        // Use a fixed namespace (DNS namespace)
        const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
        formattedUserId = uuidv5(userId, NAMESPACE);
        console.log('Generated UUID:', formattedUserId);
      }
    } catch (error) {
      console.error('Error validating/generating UUID:', error);
      // If there's an error with UUID validation, just use the original userId
      // The createProfile function will handle UUID validation/generation as fallback
    }
    
    // Add the formatted user ID to the profile data
    profileData.userId = formattedUserId;
    
    // Check if the profile already exists
    const existingProfile = await getProfileByUserId(formattedUserId);
    
    let profile;
    if (existingProfile) {
      console.log('Updating existing profile');
      // Update existing profile
      profile = await updateProfile(formattedUserId, profileData);
    } else {
      console.log('Creating new profile');
      // Create new profile
      profile = await createProfile(profileData);
    }
    
    return NextResponse.json({ 
      message: existingProfile ? 'Profile updated' : 'Profile created',
      profile 
    }, { 
      status: existingProfile ? 200 : 201 
    });
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    
    // Log detailed error information for debugging
    console.error('Error details:', JSON.stringify({
      message: error.message,
      code: error.code,
      details: error.details
    }));
    
    // Extract more detailed error information
    const errorMessage = error.message || 'Unknown error';
    const errorDetails = error.details || error.code || JSON.stringify(error);
    
    // Handle specific errors
    if (errorMessage.includes('Username already taken')) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }
    
    // Handle foreign key constraint violation
    if (errorMessage.includes('violates foreign key constraint') || 
        errorMessage.includes('23503') ||
        (errorDetails && errorDetails.includes('auth.users'))) {
      return NextResponse.json(
        { 
          error: 'Failed to link profile to user account. Please ensure you are signed in correctly.',
          details: 'Development mode: For testing without auth, edit the SQL script to remove the foreign key constraint or use the development-friendly version.'
        },
        { status: 400 }
      );
    }
    
    // Handle table not found error - most likely cause
    if (errorMessage.includes('relation') && errorMessage.includes('does not exist') ||
        errorMessage.includes('42P01') ||
        errorMessage.includes('Table') && errorMessage.includes('does not exist')) {
      return NextResponse.json(
        { 
          error: 'Database table not set up correctly', 
          details: 'The player_profiles table does not exist. Please run the SQL script from src/sql/player_profiles_table.sql in your Supabase SQL Editor.',
          solution: 'Go to Supabase Dashboard > SQL Editor and run the script in src/sql/player_profiles_table.sql'
        },
        { status: 500 }
      );
    }
    
    // Invalid UUID format
    if (errorMessage.includes('invalid input syntax for type uuid') ||
        errorMessage.includes('22P02')) {
      return NextResponse.json(
        {
          error: 'Invalid user ID format',
          details: 'The user ID is not in a valid UUID format required by Supabase.',
          solution: 'For development, use the user_id-free SQL script that allows any values'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create/update profile', 
        message: errorMessage,
        details: errorDetails,
        solution: 'Please check server logs for more details. You may need to run the SQL setup script.'
      },
      { status: 500 }
    );
  }
} 