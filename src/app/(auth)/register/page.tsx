'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    country: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Registration failed')
        return
      }

      toast.success('Account created! Please log in.')
      router.push('/login')
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <h1 className="font-display text-3xl font-bold mb-2 gradient-text-teal">
            Join Traveloop
          </h1>
          <p className="text-text-muted mb-8">Create your travel planning account</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="px-4 py-2 bg-bg-card border border-text-muted/20 rounded-lg text-text-primary focus:outline-none focus:border-accent-teal"
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="px-4 py-2 bg-bg-card border border-text-muted/20 rounded-lg text-text-primary focus:outline-none focus:border-accent-teal"
                required
              />
            </div>

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-bg-card border border-text-muted/20 rounded-lg text-text-primary focus:outline-none focus:border-accent-teal"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-bg-card border border-text-muted/20 rounded-lg text-text-primary focus:outline-none focus:border-accent-teal"
              required
            />

            <input
              name="phone"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-bg-card border border-text-muted/20 rounded-lg text-text-primary focus:outline-none focus:border-accent-teal"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                name="city"
                placeholder="City (optional)"
                value={formData.city}
                onChange={handleChange}
                className="px-4 py-2 bg-bg-card border border-text-muted/20 rounded-lg text-text-primary focus:outline-none focus:border-accent-teal"
              />
              <input
                name="country"
                placeholder="Country (optional)"
                value={formData.country}
                onChange={handleChange}
                className="px-4 py-2 bg-bg-card border border-text-muted/20 rounded-lg text-text-primary focus:outline-none focus:border-accent-teal"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-accent-teal to-accent-purple rounded-lg font-bold text-bg-deep hover:shadow-glow-teal transition-all disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted">Already have an account?{' '}
              <Link href="/login" className="text-accent-coral hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
