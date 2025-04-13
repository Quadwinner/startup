import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Handle Supabase OAuth callback
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  // Redirect the user back to the home page
  return NextResponse.redirect(new URL('/', request.url));
} 