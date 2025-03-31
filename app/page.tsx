import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/layout/site-header'
import { JournalDashboard } from '@/components/journal/journal-dashboard'

export default async function Home() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      // Create a new profile if it doesn't exist
      const { error } = await supabase.from('profiles').insert({
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || '',
        avatar_url: session.user.user_metadata?.avatar_url || '',
      })

      if (error) {
        console.error('Error creating profile:', error)
        throw error
      }
    }

    return (
      <div className="min-h-screen bg-background">
        <SiteHeader user={profile} />
        <main className="container mx-auto py-6">
          <JournalDashboard />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to EchoNest</h1>
        <p className="text-xl mb-8 text-center">
          Your AI-powered voice journaling companion
        </p>
        <div className="flex justify-center">
          <Link href="/auth/login">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 