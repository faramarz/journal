import { NextResponse } from 'next/server'
import { testServiceRoleConnection } from '@/lib/supabase/test-connection'

export async function GET() {
  try {
    const isConnected = await testServiceRoleConnection()
    
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Failed to connect to Supabase with service role' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Test connection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 