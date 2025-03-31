import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    // Test using the Supabase client directly
    const { data, error } = await sql.select('profiles', '*', { count: 'exact' });
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { 
          error: 'Database query failed', 
          message: error.message,
          code: error.code,
          details: error.details
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      count: data.length,
      profiles: data
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    // Better error handling
    const errorDetails = error instanceof Error 
      ? error.message 
      : typeof error === 'object' && error !== null
        ? JSON.stringify(error)
        : String(error);
        
    return NextResponse.json(
      { 
        error: 'Failed to connect to database', 
        details: errorDetails
      },
      { status: 500 }
    );
  }
} 