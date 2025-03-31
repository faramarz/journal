'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserProfile } from '@/components/auth/user-profile'
import type { Profile } from '@/types'

interface SiteHeaderProps {
  user: Profile
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">EchoNest</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
              Dashboard
            </Link>
            <Link href="/journal" className="transition-colors hover:text-foreground/80">
              Journal
            </Link>
            <Link href="/insights" className="transition-colors hover:text-foreground/80">
              Insights
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserProfile user={user} />
        </div>
      </div>
    </header>
  )
} 