import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    // Test with a simple query
    const result = await sql`SELECT current_timestamp`;
    
    return NextResponse.json({
      success: true,
      timestamp: result[0].current_timestamp,
      message: 'Postgres connection is working correctly'
    });
  } catch (error) {
    console.error('Postgres error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to connect to PostgreSQL', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 