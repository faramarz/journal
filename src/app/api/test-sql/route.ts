import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Initialize the Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test the connection by fetching data
    const { data, error } = await supabase.from('profiles').select('*').limit(10);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      profiles: data
    });
  } catch (error) {
    console.error('Connection error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 