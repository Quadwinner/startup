import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get all registrations
    const { data, error } = await supabase
      .from('registrations')
      .select('*');
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      count: data?.length || 0,
      registrations: data || [] 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Error fetching registrations', 
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
