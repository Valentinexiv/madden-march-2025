import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/leagues',
  '/profile',
  '/settings',
  '/api/leagues', // Protect API routes for leagues
];

// Define routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/sign-in',
  '/sign-up',
  '/reset-password',
];

// Define public routes that should always be accessible
const publicRoutes = [
  '/',
  '/about',
  '/privacy',
  '/terms',
  '/api/health', // Health check endpoint
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
  
  try {
    // Get the current path
    const path = req.nextUrl.pathname;
    
    // Check if the path is a public route that doesn't need authentication checks
    if (publicRoutes.some(route => path === route || path.startsWith(route))) {
      return res;
    }
    
    // Check if the user is authenticated
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking authentication:', error);
      // On auth error, redirect to sign-in for protected routes
      if (protectedRoutes.some(route => path.startsWith(route))) {
        const redirectUrl = new URL('/sign-in', req.url);
        redirectUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(redirectUrl);
      }
    }
    
    // If the route requires authentication and the user is not authenticated, redirect to sign-in
    if (protectedRoutes.some(route => path.startsWith(route)) && !session) {
      const redirectUrl = new URL('/sign-in', req.url);
      // Store the original URL as a redirect parameter
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If the route is an auth route and the user is already authenticated, redirect to dashboard
    if (authRoutes.some(route => path.startsWith(route)) && session) {
      // Check if there's a redirect parameter in the URL
      const redirectTo = req.nextUrl.searchParams.get('redirect');
      if (redirectTo && !authRoutes.some(route => redirectTo.startsWith(route))) {
        // Redirect to the original URL if it's not an auth route
        return NextResponse.redirect(new URL(redirectTo, req.url));
      }
      // Otherwise redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // For API routes that aren't explicitly protected but contain user-specific data
    if (path.startsWith('/api/') && path.includes('/[userId]/') && !session) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
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