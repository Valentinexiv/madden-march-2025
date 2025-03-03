import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/leagues',
  '/profile',
  '/settings',
];

// Define routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/sign-in',
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
  
  // Get the current path
  const path = req.nextUrl.pathname;
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // If the route requires authentication and the user is not authenticated, redirect to sign-in
  if (protectedRoutes.some(route => path.startsWith(route)) && !session) {
    const redirectUrl = new URL('/sign-in', req.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If the route is an auth route and the user is already authenticated, redirect to dashboard
  if (authRoutes.some(route => path.startsWith(route)) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return res;
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
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}; 