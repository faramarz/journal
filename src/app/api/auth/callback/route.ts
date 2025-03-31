import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/types/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // URL to redirect to after sign in process completes - go to dashboard instead of root
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    }
    
    console.error("Auth callback error:", error);
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin));
}

export const dynamic = 'force-dynamic'; 