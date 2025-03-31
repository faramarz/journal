'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMagicLink, setIsMagicLink] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Successfully signed in!')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Error signing in. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })

      if (error) throw error

      toast.success('Check your email for the confirmation link!')
    } catch (error: any) {
      toast.error(error.message || 'Error signing up. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })

      if (error) throw error

      toast.success('Check your email for the magic link!')
    } catch (error: any) {
      toast.error(error.message || 'Error sending magic link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {isMagicLink ? 'Sign in with Magic Link' : 'Welcome to EchoNest'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isMagicLink
            ? 'Enter your email to receive a magic link'
            : 'Sign in to your account or create a new one'}
        </p>
      </div>

      <form onSubmit={isMagicLink ? handleMagicLink : handleSignIn} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          {!isMagicLink && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : isMagicLink ? 'Send Magic Link' : 'Sign In'}
          </Button>

          {!isMagicLink && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSignUp}
              disabled={isLoading}
            >
              Create Account
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsMagicLink(!isMagicLink)}
            disabled={isLoading}
          >
            {isMagicLink ? 'Use Password Instead' : 'Use Magic Link Instead'}
          </Button>
        </div>
      </form>
    </div>
  )
} 