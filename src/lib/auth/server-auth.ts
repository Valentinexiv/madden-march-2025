'use server';

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

// Create a Supabase client for server components
export const createServerClient = () => {
  const cookieStore = cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  );
};

// Check if the user is authenticated on the server
export async function getServerSession() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Get the current user on the server
export async function getServerUser() {
  const session = await getServerSession();
  return session?.user ?? null;
}

// Redirect if not authenticated
export async function requireAuth(redirectTo: string = '/sign-in') {
  const session = await getServerSession();
  
  if (!session) {
    redirect(redirectTo);
  }
  
  return session.user;
}

// Redirect if already authenticated
export async function requireGuest(redirectTo: string = '/dashboard') {
  const session = await getServerSession();
  
  if (session) {
    redirect(redirectTo);
  }
  
  return null;
} 