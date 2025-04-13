import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET debug info
 * Returns diagnostics about the registrations database
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || '';
    
    // Check if the registrations table exists
    const { count: totalCount, error: countError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true });
      
    // Get sample records
    const { data: sampleData, error: sampleError } = await supabase
      .from('registrations')
      .select('id, tournament_id, user_id, team_name, status, payment_status, created_at')
      .limit(5);
    
    // If email provided, look for that specific user's registrations
    let userRegistrations = null;
    let userError = null;
    
    if (email) {
      const { data, error } = await supabase
        .from('registrations')
        .select('id, tournament_id, user_id, team_name, status, payment_status, created_at')
        .eq('user_id', email);
        
      userRegistrations = data;
      userError = error;
    }
    
    return NextResponse.json({
      tableStatus: {
        exists: countError ? false : true,
        totalRecords: totalCount || 0,
        error: countError ? countError.message : null
      },
      samples: sampleData || [],
      sampleError: sampleError ? sampleError.message : null,
      userSearch: {
        email: email,
        found: userRegistrations ? userRegistrations.length : 0,
        registrations: userRegistrations || [],
        error: userError ? userError.message : null
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Error fetching debug info', 
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
