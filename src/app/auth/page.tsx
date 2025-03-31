import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { AuthForm } from "@/components/auth/auth-form";

export default async function AuthPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // If user is already authenticated, redirect to home page
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={null} />
      <div className="container flex-1 flex items-center justify-center py-12">
        <AuthForm />
      </div>
    </div>
  );
} 