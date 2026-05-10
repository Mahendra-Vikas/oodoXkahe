'use client'

import { useSession } from 'next-auth/react'

export default function ProfilePage() {
  const { data: session } = useSession()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Profile</h1>
        <p className="text-text-muted">Manage your account settings</p>
      </div>

      <div className="max-w-2xl">
        <div className="glass-card p-8">
          <div className="flex items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accent-coral to-accent-gold flex items-center justify-center text-3xl font-bold text-bg-deep">
              {session?.user?.email?.[0].toUpperCase()}
            </div>
            <div className="ml-6">
              <p className="text-xl font-bold text-text-primary">{session?.user?.email}</p>
              <p className="text-text-muted">Member since today</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Email</label>
              <p className="text-text-primary">{session?.user?.email}</p>
            </div>
            <div className="pt-4 border-t border-text-muted/20">
              <button className="px-6 py-2 border border-accent-coral text-accent-coral rounded-lg hover:bg-accent-coral/10 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
