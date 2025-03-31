'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { AuthError } from '@supabase/supabase-js'

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMagicLink, setIsMagicLink] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: undefined
        }
      })

      if (error) throw error

      if (data?.user) {
        toast.success('Successfully signed in!')
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      const authError = error as AuthError
      const errorMessage = authError.message || 'Error signing in. Please check your credentials.'
      console.error('Sign in error:', errorMessage)
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          captchaToken: undefined
        }
      })

      if (error) throw error

      if (data?.user) {
        toast.success('Check your email to confirm your account!')
        setIsMagicLink(true)
      }
    } catch (error) {
      const authError = error as AuthError
      const errorMessage = authError.message || 'Error signing up. Please try again.'
      console.error('Sign up error:', errorMessage)
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          captchaToken: undefined
        }
      })

      if (error) throw error

      toast.success('Check your email for the magic link!')
    } catch (error) {
      const authError = error as AuthError
      const errorMessage = authError.message || 'Error sending magic link. Please try again.'
      console.error('Magic link error:', errorMessage)
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {isMagicLink ? 'Sign in with Magic Link' : 'Welcome back'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isMagicLink
            ? 'Enter your email to receive a magic link'
            : 'Sign in to your account to continue'}
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
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              required
              placeholder="Enter your email"
            />
          </div>
          {!isMagicLink && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                required
                placeholder="Enter your password"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : isMagicLink ? 'Send Magic Link' : 'Sign In'}
          </Button>
          {!isMagicLink ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleSignUp}
                disabled={isLoading}
              >
                Create Account
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsMagicLink(true)}
                className="text-sm"
              >
                Sign in with Magic Link instead
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsMagicLink(false)}
              className="text-sm"
            >
              Sign in with Password instead
            </Button>
          )}
        </div>
      </form>
    </div>
  )
} 