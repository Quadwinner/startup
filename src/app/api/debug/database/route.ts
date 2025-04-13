import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET debug information about database setup
 */
export async function GET(req: NextRequest) {
  try {
    // Check if the player_profiles table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return NextResponse.json(
        { error: 'Failed to fetch database tables', details: tablesError },
        { status: 500 }
      );
    }
    
    const tableNames = tables.map(t => t.table_name);
    const hasPlayerProfilesTable = tableNames.includes('player_profiles');
    
    // Get database setup instructions
    const setupInstructions = `
    # Database Setup Instructions
    
    It looks like you need to set up your database tables. Here's how:
    
    1. Go to the Supabase dashboard: https://app.supabase.com/
    2. Select your project
    3. Click on "SQL Editor" in the left sidebar
    4. Create a new query
    5. Copy and paste the SQL below:
    
    \`\`\`sql
    -- Player Profile Table Setup for Epic Esports
    -- This script creates the enhanced player profile table and relations
    
    -- Create the player profiles table
    CREATE TABLE player_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        username TEXT NOT NULL UNIQUE,
        display_name TEXT,
        bio TEXT,
        main_game TEXT,
        country TEXT,
        state TEXT,
        city TEXT,
        birth_date DATE,
        avatar_url TEXT,
        banner_url TEXT,
        social_links JSONB DEFAULT '[]'::jsonb,
        experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
        achievements JSONB DEFAULT '[]'::jsonb,
        total_tournaments INTEGER DEFAULT 0,
        tournaments_won INTEGER DEFAULT 0,
        total_matches INTEGER DEFAULT 0,
        matches_won INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Enable RLS on the table
    ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
    
    -- Create policies for Row Level Security
    CREATE POLICY "Allow read access to player profiles" 
        ON player_profiles FOR SELECT USING (true);
    
    CREATE POLICY "Allow users to update own profile" 
        ON player_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Allow authenticated insert" 
        ON player_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    -- For development, you might want a more permissive policy
    -- Comment out the above policies and uncomment these for testing
    CREATE POLICY "Allow all operations for development"
       ON player_profiles
       FOR ALL
       USING (true)
       WITH CHECK (true);
    
    -- Create indexes for better query performance
    CREATE INDEX idx_player_profiles_user_id ON player_profiles(user_id);
    CREATE INDEX idx_player_profiles_username ON player_profiles(username);
    CREATE INDEX idx_player_profiles_main_game ON player_profiles(main_game);
    \`\`\`
    
    6. Click "Run" to execute the SQL
    7. Restart your application
    `;
    
    return NextResponse.json({
      database: {
        tables: tableNames,
        hasPlayerProfilesTable,
      },
      recommendations: hasPlayerProfilesTable 
        ? "The player_profiles table exists. If you're still having issues, check the user_id reference and permissions."
        : "The player_profiles table does not exist. Please run the SQL setup script provided below.",
      setupInstructions: !hasPlayerProfilesTable ? setupInstructions : null
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { error: 'Debug check failed', details: error },
      { status: 500 }
    );
  }
} 