import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Create an RPC function that can execute SQL statements
    const { error } = await supabaseAdmin.query(`
      CREATE OR REPLACE FUNCTION create_registration_table(sql_statement TEXT)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_statement;
      END;
      $$;
    `);

    if (error) {
      console.error('Error creating SQL function:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'SQL function created successfully' 
    });
  } catch (error) {
    console.error('Error setting up SQL function:', error);
    return NextResponse.json({ 
      error: 'Failed to set up SQL function', 
      details: error 
    }, { status: 500 });
  }
} 