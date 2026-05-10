'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          Welcome back, {session?.user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-text-muted">Here's what's happening with your travels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Trips" value="0" color="coral" />
        <StatCard title="Countries Visited" value="0" color="teal" />
        <StatCard title="Days Traveled" value="0" color="gold" />
        <StatCard title="Total Spent" value="$0" color="purple" />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/trips/new">
            <button className="w-full p-6 glass-card hover:border-accent-coral transition-colors text-left">
              <div className="text-2xl mb-2">✈️</div>
              <p className="font-bold text-text-primary">Plan a New Trip</p>
              <p className="text-sm text-text-muted">Create your next adventure</p>
            </button>
          </Link>
          <Link href="/explore">
            <button className="w-full p-6 glass-card hover:border-accent-teal transition-colors text-left">
              <div className="text-2xl mb-2">🗺️</div>
              <p className="font-bold text-text-primary">Explore Destinations</p>
              <p className="text-sm text-text-muted">Discover amazing places</p>
            </button>
          </Link>
        </div>
      </div>

      {/* Trips Section */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Your Trips</h2>
        <div className="glass-card p-8 text-center">
          <p className="text-text-muted">No trips yet. Create one to get started!</p>
          <Link href="/trips/new">
            <button className="mt-4 px-6 py-2 bg-accent-coral rounded-lg font-bold text-bg-deep hover:shadow-glow-coral transition-all">
              Create Trip
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colorMap = {
    coral: 'border-accent-coral/30 text-accent-coral',
    teal: 'border-accent-teal/30 text-accent-teal',
    gold: 'border-accent-gold/30 text-accent-gold',
    purple: 'border-accent-purple/30 text-accent-purple',
  }

  return (
    <div className={`glass-card p-6 border ${colorMap[color as keyof typeof colorMap]}`}>
      <p className="text-text-muted text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}
