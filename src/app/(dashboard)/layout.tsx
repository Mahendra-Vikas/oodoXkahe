'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <div className="text-accent-teal">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-bg-deep flex">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-card border-r border-accent-teal/20 p-6">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold gradient-text-coral">
            Traveloop
          </h1>
        </div>

        <nav className="space-y-3">
          <NavLink href="/dashboard" label="🏠 Dashboard" />
          <NavLink href="/trips" label="🌍 My Trips" />
          <NavLink href="/explore" label="🔍 Explore" />
          <NavLink href="/community" label="👥 Community" />
          <NavLink href="/profile" label="👤 Profile" />
        </nav>

        <div className="mt-auto pt-8 border-t border-text-muted/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent-coral flex items-center justify-center text-bg-deep font-bold">
              {session.user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">
                {session.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            className="w-full py-2 text-sm text-accent-coral border border-accent-coral/30 rounded-lg hover:bg-accent-coral/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <div className="px-4 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-accent-coral/10 transition-colors cursor-pointer">
        {label}
      </div>
    </Link>
  )
}
