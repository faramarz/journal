import { NextResponse } from 'next/server';
import sql from '@/lib/db-client';

export async function GET() {
  try {
    // Use the SQL client to execute a simple query
    const result = await sql`SELECT NOW()`;
    
    return NextResponse.json({
      success: true,
      timestamp: result[0].now,
      message: 'PostgreSQL connection successful'
    });
  } catch (error) {
    console.error('PostgreSQL error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to connect to PostgreSQL', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 