import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { JournalDashboard } from "@/app/dashboard";

export default async function Home() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // If user is not authenticated, show the landing page
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold text-center mb-8">
            Welcome to Voice Journal
          </h1>
          <p className="text-center mb-8 text-lg">
            Your personal AI-powered voice journaling companion. Record your thoughts, get insights, and track your emotional journey.
          </p>
          <div className="flex justify-center">
            <Link href="/auth/login">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get the user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  // If profile doesn't exist, create it
  if (!profile) {
    const { data: newProfile, error } = await supabase
      .from("profiles")
      .insert([
        {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || null,
          avatar_url: session.user.user_metadata?.avatar_url || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-red-500">Failed to create your profile. Please try again.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader user={newProfile} />
        <JournalDashboard user={newProfile} />
      </div>
    );
  }

  // Show the dashboard for authenticated users
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={profile} />
      <JournalDashboard user={profile} />
    </div>
  );
}
