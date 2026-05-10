'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Trip {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  totalBudget?: number
  currency: string
  isPublic: boolean
  status: string
  _count: {
    stops: number
    notes: number
  }
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/trips')
        if (!response.ok) throw new Error('Failed to fetch trips')
        const data = await response.json()
        setTrips(data)
      } catch (error) {
        console.error('Error fetching trips:', error)
        toast.error('Failed to load trips')
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">My Trips</h1>
          <p className="text-text-muted">Manage your travel plans</p>
        </div>
        <Link href="/trips/new">
          <button className="px-6 py-3 bg-gradient-to-r from-accent-coral to-accent-gold rounded-lg font-bold text-bg-deep hover:shadow-glow-coral transition-all">
            + New Trip
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-text-muted">Loading your trips...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-text-muted text-lg mb-4">No trips yet</p>
          <p className="text-text-muted mb-8">Start planning your next adventure</p>
          <Link href="/trips/new">
            <button className="px-8 py-3 bg-accent-teal rounded-lg font-bold text-bg-deep hover:shadow-glow-teal transition-all">
              Create Your First Trip
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.id}`}>
              <div className="glass-card p-6 hover:shadow-glow-teal transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-text-primary flex-1">{trip.title}</h3>
                  {trip.isPublic && (
                    <span className="text-xs px-2 py-1 bg-accent-teal rounded-full text-bg-deep font-semibold">
                      Public
                    </span>
                  )}
                </div>

                {trip.description && (
                  <p className="text-text-muted text-sm mb-4 line-clamp-2">{trip.description}</p>
                )}

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">📅 Duration:</span>
                    <span className="text-text-primary font-semibold">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </span>
                  </div>
                  {trip.totalBudget && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">💰 Budget:</span>
                      <span className="text-accent-coral font-semibold">
                        {trip.currency} {trip.totalBudget.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">📍 Stops:</span>
                    <span className="text-text-primary font-semibold">{trip._count.stops}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-accent-teal/20">
                  <button className="w-full py-2 text-accent-teal hover:text-accent-gold transition-colors font-semibold">
                    View Details →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
