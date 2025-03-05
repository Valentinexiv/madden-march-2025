import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { syncUserAfterAuth } from '@/lib/auth/server-auth';

export async function GET(request: NextRequest) {
  try {
    // Create a Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
        },
        global: {
          headers: {
            cookie: cookies().toString(),
          },
        },
      }
    );
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        message: 'You must be signed in to check user status'
      }, { status: 401 });
    }
    
    // Get the user from the session
    const user = session.user;
    
    // Check if the user exists in our database
    const result = await syncUserAfterAuth(user);
    
    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      isNewUser: result.isNewUser,
      shouldRedirectToOnboarding: result.isNewUser,
      syncResult: result
    });
  } catch (error) {
    console.error('Error in user-status API route:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 