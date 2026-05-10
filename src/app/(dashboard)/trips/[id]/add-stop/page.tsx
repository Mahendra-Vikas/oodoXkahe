'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { PlaceAutocomplete } from '@/components/maps/PlaceAutocomplete'

interface Stop {
  city: string
  country: string
  lat: number
  lng: number
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AddStopPage({ params }: PageProps) {
  const router = useRouter()
  const [clientReady, setClientReady] = useState(false)
  const [tripId, setTripId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Stop | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Unwrap params on client side
  useEffect(() => {
    if (!tripId) {
      Promise.resolve(params).then((p) => {
        setTripId(p.id)
        setClientReady(true)
      })
    }
  }, [tripId, params])

  if (!clientReady || !tripId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-secondary">Loading...</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlace) {
      toast.error('Please select a city')
      return
    }

    if (!startDate || !endDate) {
      toast.error('Please select start and end dates')
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/trips/${tripId}/stops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: selectedPlace.city,
          country: selectedPlace.country,
          lat: selectedPlace.lat,
          lng: selectedPlace.lng,
          startDate,
          endDate,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add stop')
      }

      toast.success('Stop added successfully!')
      router.push(`/trips/${tripId}`)
    } catch (error) {
      console.error('Error adding stop:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add stop')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => router.back()}
          className="text-accent-teal hover:text-accent-teal/80 flex items-center gap-2 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-text-primary">Add a Stop</h1>
        <p className="text-text-secondary mt-2">Add a new destination to your trip</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* City Selection */}
        <div>
          <label className="block text-text-primary font-medium mb-3">
            City / Destination *
          </label>
          <PlaceAutocomplete
            onSelect={(place) => {
              setSelectedPlace({
                city: place.cityName,
                country: place.country,
                lat: place.lat,
                lng: place.lng,
              })
            }}
          />
          {selectedPlace && (
            <div className="mt-2 p-3 bg-bg-deep border border-accent-teal rounded-lg">
              <p className="text-text-primary font-medium">
                {selectedPlace.city}, {selectedPlace.country}
              </p>
              <p className="text-text-secondary text-sm">
                Coordinates: {selectedPlace.lat.toFixed(4)}, {selectedPlace.lng.toFixed(4)}
              </p>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-text-primary font-medium mb-3">
              Start Date *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
            />
          </div>
          <div>
            <label className="block text-text-primary font-medium mb-3">
              End Date *
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-accent-teal text-text-primary font-semibold py-3 rounded-lg hover:bg-accent-teal/90 disabled:opacity-50 transition"
          >
            {loading ? 'Adding...' : '✓ Add Stop'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-bg-deep border border-accent-teal text-text-primary font-semibold py-3 rounded-lg hover:bg-bg-light transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
