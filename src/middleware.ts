import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/leagues',
  '/profile',
  '/settings',
  // '/api/leagues', // Commenting out to allow Madden Companion app access
];

// Define routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/sign-in',
  '/sign-up',
  '/reset-password',
  '/', // Add home page to redirect to dashboard if authenticated
];

// Define public routes that should always be accessible
const publicRoutes = [
  '/about',
  '/privacy',
  '/terms',
  '/api/health', // Health check endpoint
  '/auth/callback', // Auth callback should always be accessible
  '/.well-known/oauth-callback', // OAuth well-known URL
  '/onboarding', // Add onboarding to public routes - we'll handle auth inside the page
  '/api/leagues', // Allow access to league API routes for the Madden Companion app
  '/api/debug', // Allow access to debug endpoints
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Log the beginning of middleware execution with timestamp
  console.log(`[${new Date().toISOString()}] Middleware executing for path: ${req.nextUrl.pathname}`);
  
  // Debug cookie information
  const cookieStr = req.headers.get('cookie') || '';
  console.log(`Cookie header: ${cookieStr.substring(0, 100)}${cookieStr.length > 100 ? '...' : ''}`);
  
  // Create a Supabase client using the createMiddlewareClient helper
  // This handles the cookie access properly in the middleware context
  const supabase = createMiddlewareClient({ req, res });
  
  try {
    // Get the current path
    const path = req.nextUrl.pathname;
    
    // Log the full URL for debugging
    console.log(`Full URL: ${req.url}`);
    
    // DEBUG: Check all Supabase cookies that might be present
    const sbAccessToken = req.cookies.get('sb-access-token')?.value;
    const sbRefreshToken = req.cookies.get('sb-refresh-token')?.value;
    const sbProvider = req.cookies.get('sb-provider')?.value;
    
    console.log(`Auth cookies check: access=${!!sbAccessToken}, refresh=${!!sbRefreshToken}, provider=${sbProvider || 'none'}`);
    
    // Check if the path is a public route that doesn't need authentication checks
    if (publicRoutes.some(route => path === route || path.startsWith(route))) {
      // Always allow access to public routes
      console.log(`Public route: ${path}, allowing access`);
      return res;
    }
    
    // Check if the user is authenticated
    console.log(`Checking auth session for path: ${path}`);
    const { data: { session }, error } = await supabase.auth.getSession();
    
    console.log(`Session check result: ${!!session ? 'Authenticated' : 'Not authenticated'}`);
    if (session) {
      console.log(`User ID: ${session.user.id}, Email: ${session.user.email}`);
    }
    
    if (error) {
      console.error('Error checking authentication:', error);
      // On auth error, redirect to sign-in for protected routes
      if (protectedRoutes.some(route => path.startsWith(route))) {
        console.error(`Auth error for protected route ${path}, redirecting to sign-in`);
        const redirectUrl = new URL('/sign-in', req.url);
        redirectUrl.searchParams.set('redirect', path);
        redirectUrl.searchParams.set('error', 'auth_error');
        return NextResponse.redirect(redirectUrl);
      }
    }
    
    // If the route requires authentication and the user is not authenticated, redirect to sign-in
    if (protectedRoutes.some(route => path.startsWith(route)) && !session) {
      console.log(`Protected route: ${path}, no session, redirecting to sign-in`);
      const redirectUrl = new URL('/sign-in', req.url);
      // Store the original URL as a redirect parameter
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If the route is an auth route and the user is already authenticated, redirect to dashboard
    if (authRoutes.some(route => path === route || path === route + '/') && session) {
      console.log(`Auth route: ${path}, user authenticated, redirecting to dashboard`);
      // Check if there's a redirect parameter in the URL
      const redirectTo = req.nextUrl.searchParams.get('redirect');
      if (redirectTo && !authRoutes.some(route => redirectTo.startsWith(route))) {
        // Redirect to the original URL if it's not an auth route
        console.log(`Redirecting to original URL: ${redirectTo}`);
        return NextResponse.redirect(new URL(redirectTo, req.url));
      }
      // Otherwise redirect to dashboard
      console.log(`Redirecting to dashboard`);
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // For API routes that aren't explicitly protected but contain user-specific data
    if (path.startsWith('/api/') && path.includes('/[userId]/') && !session) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Middleware completed for ${path}: allowing access`);
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // Return the response without modification on error
    return res;
  }
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 