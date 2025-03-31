import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successfully exchanged the code for a session
      // Redirect to dashboard
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
    
    console.error("Auth callback error:", error)
  }

  // If there was an error or no code, redirect to login
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
} 