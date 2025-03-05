'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '../supabase/server';

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

/**
 * Create or update a user in our custom users table after authentication
 * @param authUser The user object from Supabase Auth
 * @returns Object indicating success or failure, and whether this is a new user
 */
export async function syncUserAfterAuth(authUser: any) {
  try {
    console.log('Starting user sync with auth user data');
    
    // Use the UUID directly from Auth
    const userId = authUser.id;
    
    if (!userId) {
      throw new Error('No user ID found in auth user data');
    }
    
    console.log(`Using auth user ID: ${userId}`);
    
    // Test if we can access the table
    const { data: tableTest, error: tableError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' })
      .limit(1);
      
    if (tableError) {
      console.error('Error accessing users table:', tableError);
      throw new Error(`Cannot access users table: ${tableError.message}`);
    }
    
    console.log('Successfully accessed users table');
    
    // Extract Discord info
    let discordId = null;
    let displayName = null;
    let avatarUrl = null;
    
    if (authUser.identities && Array.isArray(authUser.identities)) {
      const discordIdentity = authUser.identities.find((i: any) => i.provider === 'discord');
      if (discordIdentity) {
        discordId = discordIdentity.id;
      }
    }
    
    // Try to extract username and avatar from metadata
    const metadata = authUser.raw_user_meta_data || authUser.user_metadata || {};
    
    displayName = metadata.full_name || 
                metadata.name || 
                metadata.preferred_username || 
                metadata.global_name || 
                authUser.email?.split('@')[0] || 
                'User';
    
    avatarUrl = metadata.avatar_url || 
               metadata.picture || 
               null;
    
    // Check if user exists first
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for existing user:', checkError);
    }
    
    // Flag to indicate if this is a new user
    const isNewUser = !existingUser;
    
    // Prepare user data
    const userData = {
      id: userId,
      email: authUser.email || '',
      username: displayName,
      discord_id: discordId,
      avatar: avatarUrl,
      updated_at: new Date().toISOString()
    };
    
    if (isNewUser) {
      // Add created_at for new users
      userData.created_at = new Date().toISOString();
    }
    
    console.log('Prepared user data:', userData);
    
    // Insert or update user
    const { data: upsertedData, error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert([userData])
      .select();
    
    if (upsertError) {
      console.error('Error upserting user:', upsertError);
      throw upsertError;
    }
    
    console.log('User successfully upserted:', upsertedData);
    console.log('Is new user:', isNewUser);

    return { success: true, userId: userId, isNewUser };
  } catch (error) {
    console.error('Error syncing user data:', error);
    return { success: false, error };
  }
} 