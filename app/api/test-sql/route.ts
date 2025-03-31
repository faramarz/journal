import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Initialize the Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Using Supabase URL:', supabaseUrl);
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test the connection by fetching data
    const { data, error } = await supabase.from('profiles').select('*').limit(10);
    
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { 
          error: 'Supabase query error', 
          message: error.message,
          code: error.code,
          details: error.details
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      profiles: data
    });
  } catch (error) {
    console.error('Connection error:', error);
    
    let errorDetails = 'Unknown error';
    if (error instanceof Error) {
      errorDetails = error.message;
    } else if (typeof error === 'object' && error !== null) {
      try {
        errorDetails = JSON.stringify(error);
      } catch (e) {
        errorDetails = 'Error object could not be stringified';
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to connect', 
        details: errorDetails
      },
      { status: 500 }
    );
  }
} 