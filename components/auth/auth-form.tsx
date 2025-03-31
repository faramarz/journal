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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          captchaToken: undefined,
          data: {
            session_expiry: 86400
          }
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
        <h2 className="text-2xl font-bold">Sign in with Magic Link</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email to receive a magic link
        </p>
      </div>

      <form onSubmit={handleMagicLink} className="mt-8 space-y-6">
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
            {isLoading ? 'Loading...' : 'Send Magic Link'}
          </Button>
        </div>
      </form>
    </div>
  )
} 