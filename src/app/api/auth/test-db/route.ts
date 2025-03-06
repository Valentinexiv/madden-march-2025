import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Test accessing the users table
    const { data: tableTest, error: tableError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' })
      .limit(1);
      
    if (tableError) {
      return NextResponse.json({ 
        error: true, 
        message: 'Cannot access users table', 
        details: tableError 
      }, { status: 500 });
    }
    
    // Generate a numeric test user ID since the id column is an integer
    const testUserId = Date.now() % 1000000; // Use a number that fits in integer range
    
    // Prepare test user data
    const testUserData = {
      id: testUserId,
      email: 'test@example.com',
      username: 'Test User',
      discord_id: null,
      discord_username: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Attempt to insert test user
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([testUserData])
      .select();
    
    if (insertError) {
      return NextResponse.json({ 
        error: true, 
        message: 'Error inserting test user', 
        details: insertError 
      }, { status: 500 });
    }
    
    // If we get here, table access and insert are working
    return NextResponse.json({ 
      success: true, 
      message: 'Database test successful',
      tableAccess: tableTest,
      insertedUser: insertedData
    });
  } catch (error) {
    return NextResponse.json({ 
      error: true, 
      message: 'Unexpected error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}