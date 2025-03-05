import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

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
        message: 'You must be signed in to test the onboarding flow'
      }, { status: 401 });
    }
    
    // Simulate a redirect to the onboarding page
    return NextResponse.json({ 
      success: true,
      message: 'You can now test the onboarding flow by visiting /onboarding',
      onboardingUrl: '/onboarding'
    });
  } catch (error) {
    console.error('Error in test-onboarding API route:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 