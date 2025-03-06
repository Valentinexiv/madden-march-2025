import { NextRequest, NextResponse } from 'next/server';
import { syncUserAfterAuth } from '@/lib/auth/server-auth';

export async function POST(request: NextRequest) {
  try {
    console.log('Received sync-user request');
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { user } = body;
    
    if (!user || !user.id) {
      console.error('Invalid user data received:', user);
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }
    
    console.log(`Processing sync for user ID: ${user.id}`);
    
    // Sync the user data with our database
    const result = await syncUserAfterAuth(user);
    
    if (!result.success) {
      console.error('Failed to sync user data:', result.error);
      return NextResponse.json({ 
        error: 'Failed to sync user data', 
        details: result.error 
      }, { status: 500 });
    }
    
    console.log('User successfully synced');
    return NextResponse.json({ 
      success: true,
      isNewUser: result.isNewUser
    });
  } catch (error) {
    console.error('Error in sync-user API route:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}