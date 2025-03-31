import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SiteHeader } from '@/components/layout/site-header'
import { JournalDashboard } from '@/components/journal/journal-dashboard'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

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