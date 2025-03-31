"use client";

import Link from "next/link";
import { Profile } from "@/types";
import { UserProfile } from "@/components/auth/user-profile";

interface SiteHeaderProps {
  user: Profile;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Voice Journal</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search or other controls here */}
          </div>
          <nav className="flex items-center">
            <UserProfile user={user} />
          </nav>
        </div>
      </div>
    </header>
  );
} 