import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data, error } = await supabase.from('profiles').select('count').limit(1)

    if (error) throw error

    return NextResponse.json({ status: 'success', message: 'Connected to Supabase' })
  } catch (error) {
    console.error('Supabase connection error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Failed to connect to Supabase' },
      { status: 500 }
    )
  }
} 