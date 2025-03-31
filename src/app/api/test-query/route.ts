import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    // Try to fetch data from the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to query Supabase data', details: error.message },
        { status: 500 }
      );
    }
    
    // Return the data with a success message
    return NextResponse.json({
      success: true,
      message: 'Successfully queried Supabase data',
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Test query error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
} 