'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Session, type User } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Initialize the Supabase client for client-side components using the correct client
// Using createClientComponentClient instead of createBrowserClient to avoid the cookie access error
export const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  options: {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
});

// Function to get the current session with localStorage fallback
export async function getClientSession(): Promise<Session | null> {
  try {
    console.log('Attempting to get client session');
    
    // First try the normal way
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session) {
      console.log("Got session from Supabase client:", session.user.id);
      return session;
    } else {
      console.log("No session found through getSession()");
    }
    
    // If no session, try to explicitly refresh
    console.log("Attempting to refresh session...");
    try {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshData?.session) {
        console.log("Got session through refresh:", refreshData.session.user.id);
        return refreshData.session;
      } else if (refreshError) {
        console.error("Session refresh error:", refreshError);
      } else {
        console.log("Refresh completed but no session available");
      }
    } catch (refreshErr) {
      console.error("Error during session refresh:", refreshErr);
    }
    
    // If no session but we have a token in localStorage, try to use it
    if (typeof window !== 'undefined') {
      const fallbackToken = localStorage.getItem('supabase_auth_token');
      if (fallbackToken) {
        console.log("Using fallback token from localStorage");
        
        try {
          // Set the session manually using the stored token
          const { data, error: setError } = await supabase.auth.setSession({
            access_token: fallbackToken,
            refresh_token: ''
          });
          
          if (setError) {
            console.error("Error setting session from fallback token:", setError);
          } else if (data?.session) {
            return data.session;
          }
        } catch (setErr) {
          console.error("Error setting session from token:", setErr);
        }
      }
    }
    
    console.log("No session available through any method");
    return null;
  } catch (error) {
    console.error("Error getting client session:", error);
    return null;
  }
}

// Function to get the current user with localStorage fallback
export async function getClientUser(): Promise<User | null> {
  const session = await getClientSession();
  return session?.user || null;
}

// Helper function to get the current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (err) {
    console.error("Error getting current user:", err);
    return null;
  }
};

// Helper function to sign out
export const signOut = async (): Promise<void> => {
  console.log("Signing out user");
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log("Sign out completed");
    
    // Clear any local storage items related to auth
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase_auth_token');
      localStorage.removeItem('supabase_user_id');
      localStorage.removeItem('authRedirectUrl');
    }
  } catch (err) {
    console.error("Error during sign out:", err);
  }
};

// Helper function to get session
export const getSession = async (): Promise<Session | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (err) {
    console.error("Error getting session:", err);
    return null;
  }
}; 