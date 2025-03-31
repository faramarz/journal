import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
      // Disable captcha verification in middleware by using implicit flow
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        flowType: 'implicit',
        // Additional config to manage sessions effectively
        detectSessionInUrl: true
      }
    }
  );

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Auth callback paths should be excluded from redirection
    if (req.nextUrl.pathname.includes('/auth/callback') || 
        req.nextUrl.pathname.includes('/api/auth/callback')) {
      return res;
    }

    // If user is not signed in and the current path is not / or /auth/login,
    // redirect the user to /auth/login
    if (!session && !['/auth/login', '/'].includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // If user is signed in and the current path is /auth/login,
    // redirect the user to /
    if (session && req.nextUrl.pathname === '/auth/login') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/((?!auth/callback|api/auth/callback).*)',
  ],
}; 