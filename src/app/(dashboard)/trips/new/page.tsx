'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function NewTripPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    currency: 'USD',
    isPublic: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.startDate || !formData.endDate) {
        toast.error('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Validate dates
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        toast.error('Start date must be before end date')
        setLoading(false)
        return
      }

      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalBudget: formData.totalBudget ? parseFloat(formData.totalBudget) : null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create trip')
      }

      const trip = await response.json()
      toast.success('Trip created successfully!')
      router.push(`/trips`)
    } catch (error) {
      console.error('Error creating trip:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/trips">
          <button className="text-accent-teal hover:text-accent-gold transition-colors">← Back to Trips</button>
        </Link>
        <h1 className="text-4xl font-bold text-text-primary mt-4 mb-2">Plan a New Trip</h1>
        <p className="text-text-muted">Create your next adventure</p>
      </div>

      <div className="glass-card p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Title */}
          <div>
            <label className="block text-text-primary font-semibold mb-2">Trip Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Paris Summer 2026"
              className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-text-primary font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your trip..."
              rows={4}
              className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-primary font-semibold mb-2">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
                required
              />
            </div>
            <div>
              <label className="block text-text-primary font-semibold mb-2">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
                required
              />
            </div>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-primary font-semibold mb-2">Total Budget</label>
              <input
                type="number"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
              />
            </div>
            <div>
              <label className="block text-text-primary font-semibold mb-2">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-deep border border-accent-teal rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal transition"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>JPY</option>
                <option>INR</option>
                <option>AUD</option>
              </select>
            </div>
          </div>

          {/* Public Trip */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="w-5 h-5 accent-accent-teal rounded cursor-pointer"
            />
            <label htmlFor="isPublic" className="text-text-primary cursor-pointer">
              Make this trip public (share with community)
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-accent-coral to-accent-gold rounded-lg font-bold text-bg-deep hover:shadow-glow-coral transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Trip'}
            </button>
            <Link href="/trips" className="flex-1">
              <button
                type="button"
                className="w-full px-6 py-3 border border-accent-teal rounded-lg font-bold text-accent-teal hover:bg-accent-teal hover:text-bg-deep transition-all"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
