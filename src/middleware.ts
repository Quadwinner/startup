import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Get the session token from cookies
  const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
                       request.cookies.get('__Secure-next-auth.session-token')?.value;
  
  const isAuthenticated = !!sessionToken;
  
  // If it's an admin route
  if (path.startsWith('/admin')) {
    // If not logged in, redirect to login
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    }
  }

  // If it's a member route, check if user is logged in
  if (path.startsWith('/member')) {
    // If not logged in, redirect to login
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    }
  }

  // For everything else, continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/member/:path*'],
}; 