import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to EchoNest
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
  )
} 