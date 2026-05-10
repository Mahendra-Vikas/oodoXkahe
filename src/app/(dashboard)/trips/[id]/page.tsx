'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
import { exportTripToPDF } from '@/lib/pdfExport'
import { WeatherWidget } from '@/components/weather/WeatherWidget'

const TripMap = dynamic(() => import('@/components/maps/TripMap').then(m => m.TripMap), { ssr: false })

interface Stop {
  id: string
  cityName: string
  country?: string
  lat?: number
  lng?: number
  startDate: string
  endDate: string
  orderIndex: number
}

interface Activity {
  id: string
  name: string
  description?: string
  cost?: number
  location?: string
}

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: string
}

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
  stops?: Stop[]
  activities?: Activity[]
  expenses?: Expense[]
  coverImage?: string
  _count?: {
    stops: number
    activities: number
    expenses: number
  }
}

export default function TripDetailPage() {
  const params = useParams()
  const tripId = params.id as string
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/trips/${tripId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch trip')
        }
        const data = await response.json()
        setTrip(data)
      } catch (err: any) {
        console.error('Error fetching trip:', err)
        setError(err.message || 'Failed to load trip')
        toast.error('Failed to load trip details')
      } finally {
        setLoading(false)
      }
    }

    if (tripId) {
      fetchTrip()
    }
  }, [tripId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: trip?.currency || 'USD',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-accent-teal border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted">Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="p-8">
        <div className="glass-card p-8 text-center">
          <p className="text-accent-coral text-lg mb-4">❌ {error || 'Trip not found'}</p>
          <Link href="/trips">
            <button className="px-6 py-2 bg-accent-teal rounded-lg text-bg-deep font-semibold hover:shadow-glow-teal transition-all">
              Back to Trips
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const totalExpenses = trip.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0
  const remainingBudget = trip.totalBudget ? trip.totalBudget - totalExpenses : 0
  const stopsWithCoords = (trip.stops || []).filter(s => s.lat && s.lng)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link href="/trips">
            <button className="text-accent-teal hover:text-accent-gold mb-4 transition-colors">
              ← Back to Trips
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-text-primary mb-2">{trip.title}</h1>
          {trip.description && (
            <p className="text-text-muted max-w-2xl">{trip.description}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportTripToPDF({
              title: trip.title,
              description: trip.description,
              startDate: trip.startDate,
              endDate: trip.endDate,
              totalBudget: trip.totalBudget,
              currency: trip.currency,
              stops: trip.stops || [],
              expenses: trip.expenses || [],
            })}
            className="px-4 py-2 bg-gradient-to-r from-accent-coral to-accent-gold rounded-lg text-bg-deep font-semibold hover:shadow-glow-coral transition-all"
          >
            📄 Export PDF
          </button>
          <Link href={`/trips/${trip.id}/edit`}>
            <button className="px-4 py-2 bg-accent-teal rounded-lg text-bg-deep font-semibold hover:shadow-glow-teal transition-all">
              ✏️ Edit
            </button>
          </Link>
        </div>
      </div>

      {/* Trip Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4">
          <p className="text-text-muted text-sm mb-1">📅 Duration</p>
          <p className="text-xl font-bold text-text-primary">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {Math.ceil(
              (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
            )} days
          </p>
        </div>

        <div className="glass-card p-4">
          <p className="text-text-muted text-sm mb-1">🏙️ Stops</p>
          <p className="text-xl font-bold text-text-primary">{trip._count?.stops || 0}</p>
        </div>

        <div className="glass-card p-4">
          <p className="text-text-muted text-sm mb-1">💰 Budget</p>
          <p className="text-xl font-bold text-accent-coral">
            {trip.totalBudget ? formatMoney(trip.totalBudget) : 'Not set'}
          </p>
        </div>

        <div className="glass-card p-4">
          <p className="text-text-muted text-sm mb-1">📊 Spent</p>
          <p className="text-xl font-bold text-accent-gold">{formatMoney(totalExpenses)}</p>
          {trip.totalBudget && (
            <p className="text-xs text-text-muted mt-1">
              Remaining: {formatMoney(remainingBudget)}
            </p>
          )}
        </div>
      </div>

      {/* Map Section */}
      {stopsWithCoords.length > 0 && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">📍 Trip Map</h2>
          <div className="rounded-xl overflow-hidden" style={{ minHeight: '400px' }}>
            <TripMap 
              stops={stopsWithCoords.map((s, idx) => ({
                lat: s.lat!,
                lng: s.lng!,
                cityName: s.cityName,
                orderIndex: idx,
              }))}
            />
          </div>
        </div>
      )}

      {/* Stops Section */}
      {(trip.stops && trip.stops.length > 0) && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">🌍 Stops</h2>
          <div className="space-y-4">
            {trip.stops.map((stop, idx) => (
              <div
                key={stop.id}
                className="border-l-4 border-accent-teal pl-4 py-2"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-lg font-bold text-text-primary">
                      Stop {idx + 1}: {stop.cityName}
                      {stop.country && <span className="text-text-muted"> • {stop.country}</span>}
                    </p>
                    <p className="text-sm text-text-muted">
                      {formatDate(stop.startDate)} → {formatDate(stop.endDate)}
                    </p>
                  </div>
                </div>

                {/* Weather Widget for Stop */}
                <div className="mb-3 max-w-xs">
                  <WeatherWidget city={stop.cityName} />
                </div>

                {/* Activities for this Stop */}
                {trip.activities && trip.activities.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-semibold text-accent-coral">Activities:</p>
                    {trip.activities.map(activity => (
                      <div key={activity.id} className="text-sm ml-2 p-2 rounded bg-bg-card/50">
                        <p className="text-text-primary">• {activity.name}</p>
                        {activity.description && (
                          <p className="text-xs text-text-muted">{activity.description}</p>
                        )}
                        {activity.cost && (
                          <p className="text-xs text-accent-gold">Cost: {formatMoney(activity.cost)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expenses Section */}
      {(trip.expenses && trip.expenses.length > 0) && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">💳 Expenses</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent-teal/20">
                  <th className="text-left py-2 px-3 text-text-muted font-semibold">Category</th>
                  <th className="text-left py-2 px-3 text-text-muted font-semibold">Description</th>
                  <th className="text-left py-2 px-3 text-text-muted font-semibold">Amount</th>
                  <th className="text-left py-2 px-3 text-text-muted font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {trip.expenses.map(expense => (
                  <tr key={expense.id} className="border-b border-bg-card hover:bg-bg-card/50 transition-colors">
                    <td className="py-3 px-3 text-text-primary">{expense.category}</td>
                    <td className="py-3 px-3 text-text-muted">{expense.description}</td>
                    <td className="py-3 px-3 text-accent-gold font-semibold">{formatMoney(expense.amount)}</td>
                    <td className="py-3 px-3 text-text-muted text-sm">{formatDate(expense.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expense Summary */}
          <div className="mt-6 pt-4 border-t border-accent-teal/20">
            <div className="flex justify-end gap-8">
              <div>
                <p className="text-text-muted text-sm mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-accent-gold">{formatMoney(totalExpenses)}</p>
              </div>
              {trip.totalBudget && (
                <>
                  <div>
                    <p className="text-text-muted text-sm mb-1">Budget</p>
                    <p className="text-2xl font-bold text-accent-coral">{formatMoney(trip.totalBudget)}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-sm mb-1">Remaining</p>
                    <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-accent-teal' : 'text-red-500'}`}>
                      {formatMoney(remainingBudget)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty States */}
      {(!trip.stops || trip.stops.length === 0) && (
        <div className="glass-card p-8 text-center mb-8">
          <p className="text-text-muted mb-4">No stops added yet</p>
          <Link href={`/trips/${trip.id}/add-stop`}>
            <button className="px-4 py-2 bg-accent-teal rounded-lg text-bg-deep font-semibold">
              + Add Stop
            </button>
          </Link>
        </div>
      )}

      {(!trip.expenses || trip.expenses.length === 0) && (
        <div className="glass-card p-8 text-center">
          <p className="text-text-muted mb-4">No expenses tracked yet</p>
          <Link href={`/trips/${trip.id}/add-expense`}>
            <button className="px-4 py-2 bg-accent-coral rounded-lg text-bg-deep font-semibold">
              + Add Expense
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}
