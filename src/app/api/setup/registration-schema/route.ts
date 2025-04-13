import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Create tournament_registrations table
    const { error: tableError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS tournament_registrations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
        user_id UUID,
        team_name TEXT NOT NULL,
        team_members JSONB DEFAULT '[]'::jsonb,
        payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
        payment_details JSONB DEFAULT '{}'::jsonb,
        registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
        notes TEXT,
        is_approved BOOLEAN DEFAULT false,
        approved_at TIMESTAMP WITH TIME ZONE,
        approved_by TEXT,
        UNIQUE(tournament_id, team_name)
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_tournament_registrations_tournament_id ON tournament_registrations(tournament_id);
      CREATE INDEX IF NOT EXISTS idx_tournament_registrations_user_id ON tournament_registrations(user_id);
      CREATE INDEX IF NOT EXISTS idx_tournament_registrations_payment_status ON tournament_registrations(payment_status);

      -- Enable Row Level Security
      ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;

      -- Create policies
      DROP POLICY IF EXISTS "Allow public read access" ON tournament_registrations;
      CREATE POLICY "Allow public read access" 
      ON tournament_registrations FOR SELECT 
      TO authenticated
      USING (true);

      DROP POLICY IF EXISTS "Allow authenticated insert" ON tournament_registrations;
      CREATE POLICY "Allow authenticated insert" 
      ON tournament_registrations FOR INSERT 
      TO authenticated
      WITH CHECK (true);

      DROP POLICY IF EXISTS "Allow individual update" ON tournament_registrations;
      CREATE POLICY "Allow individual update" 
      ON tournament_registrations FOR UPDATE 
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
    `);

    if (tableError) {
      console.error('Error creating registration table:', tableError);
      return NextResponse.json({ error: tableError.message }, { status: 500 });
    }

    // Create registration functions
    const { error: funcError } = await supabaseAdmin.query(`
      -- Function to create a registration
      CREATE OR REPLACE FUNCTION create_tournament_registration(
        p_tournament_id UUID,
        p_user_id UUID,
        p_team_name TEXT,
        p_team_members JSONB DEFAULT '[]'::jsonb,
        p_payment_details JSONB DEFAULT '{}'::jsonb,
        p_notes TEXT DEFAULT NULL
      ) RETURNS UUID
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        v_id UUID;
      BEGIN
        INSERT INTO tournament_registrations (
          tournament_id, user_id, team_name, team_members, payment_details, notes
        ) VALUES (
          p_tournament_id, p_user_id, p_team_name, p_team_members, p_payment_details, p_notes
        )
        RETURNING id INTO v_id;
        
        -- Update current_teams count in tournaments table
        UPDATE tournaments
        SET current_teams = current_teams + 1
        WHERE id = p_tournament_id;
        
        RETURN v_id;
      END;
      $$;

      -- Function to update payment status
      CREATE OR REPLACE FUNCTION update_registration_payment_status(
        p_registration_id UUID,
        p_status TEXT,
        p_payment_details JSONB DEFAULT NULL
      ) RETURNS BOOLEAN
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        UPDATE tournament_registrations
        SET 
          payment_status = p_status,
          payment_details = COALESCE(p_payment_details, payment_details)
        WHERE id = p_registration_id;
        
        RETURN FOUND;
      END;
      $$;
    `);

    if (funcError) {
      console.error('Error creating registration functions:', funcError);
      return NextResponse.json({ error: funcError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Tournament registration schema set up successfully' 
    });
  } catch (error) {
    console.error('Error setting up registration schema:', error);
    return NextResponse.json({ 
      error: 'Failed to set up registration schema', 
      details: error 
    }, { status: 500 });
  }
} 