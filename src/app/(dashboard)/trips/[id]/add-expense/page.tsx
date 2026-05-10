'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const EXPENSE_CATEGORIES = [
  'Accommodation',
  'Food & Dining',
  'Transportation',
  'Activities & Entertainment',
  'Shopping',
  'Flights',
  'Other',
]

interface Stop {
  id: string
  city: string
  country: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AddExpensePage({ params }: PageProps) {
  const router = useRouter()
  const [clientReady, setClientReady] = useState(false)
  const [tripId, setTripId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [stops, setStops] = useState<Stop[]>([])
  const [category, setCategory] = useState('Food & Dining')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [stopId, setStopId] = useState('')

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

  // Fetch stops for this trip
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await fetch(`/api/trips/${tripId}/stops`)
        if (response.ok) {
          const data = await response.json()
          setStops(data)
        }
      } catch (error) {
        console.error('Error fetching stops:', error)
      }
    }

    fetchStops()
  }, [tripId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!category || !amount || !date) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/trips/${tripId}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          description,
          amount: parseFloat(amount),
          date,
          stopId: stopId || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add expense')
      }

      toast.success('Expense added successfully!')
      router.push(`/trips/${tripId}`)
    } catch (error) {
      console.error('Error adding expense:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add expense')
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
        <h1 className="text-3xl font-bold text-text-primary">Add Expense</h1>
        <p className="text-text-secondary mt-2">Track your spending for this trip</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Category */}
        <div>
          <label className="block text-text-primary font-medium mb-3">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-text-primary font-medium mb-3">
            Description
          </label>
          <input
            type="text"
            placeholder="e.g., Dinner at Senso-ji Temple"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
          />
        </div>

        {/* Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-text-primary font-medium mb-3">
              Amount *
            </label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-text-primary font-medium mb-3">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
            />
          </div>
        </div>

        {/* Stop (Optional) */}
        {stops.length > 0 && (
          <div>
            <label className="block text-text-primary font-medium mb-3">
              Trip Stop (Optional)
            </label>
            <select
              value={stopId}
              onChange={(e) => setStopId(e.target.value)}
              className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
            >
              <option value="">Select a stop...</option>
              {stops.map((stop) => (
                <option key={stop.id} value={stop.id}>
                  {stop.city}, {stop.country}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-accent-teal text-text-primary font-semibold py-3 rounded-lg hover:bg-accent-teal/90 disabled:opacity-50 transition"
          >
            {loading ? 'Adding...' : '💰 Add Expense'}
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
