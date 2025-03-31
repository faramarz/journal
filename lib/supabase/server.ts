import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export const createServerSupabaseClient = () => {
  const cookieStore = cookies()

  // We need to use type assertion to add auth options to the server component client
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
    // Disable captcha verification for server-side client
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      authFlowType: 'implicit',
      captchaVerification: false
    }
  } as any)
} 