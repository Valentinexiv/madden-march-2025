'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Create a Supabase client for server components
const createServerSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          cookie: cookies().toString(),
        },
      },
    }
  );
};

/**
 * Get the current session from Supabase on the server
 * @returns The current session or null if not authenticated
 */
export async function getServerSession() {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    
    return data.session;
  } catch (error) {
    console.error('Error in getServerSession:', error);
    return null;
  }
}

/**
 * Get the current user from Supabase on the server
 * @returns The current user or null if not authenticated
 */
export async function getServerUser() {
  const session = await getServerSession();
  return session?.user || null;
}

/**
 * Check if the user is authenticated on the server
 * @returns True if authenticated, false otherwise
 */
export async function isAuthenticated() {
  const session = await getServerSession();
  return !!session;
}

/**
 * Require authentication for a server component
 * If not authenticated, redirect to the sign-in page
 * @param redirectTo The path to redirect to if not authenticated
 */
export async function requireAuth(redirectTo: string = '/sign-in') {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect(redirectTo);
  }
}

/**
 * Redirect if already authenticated
 * Useful for sign-in/sign-up pages
 * @param redirectTo The path to redirect to if authenticated
 */
export async function redirectIfAuthenticated(redirectTo: string = '/dashboard') {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    redirect(redirectTo);
  }
} 