import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Traveloop — Plan Your Adventure",
  description: "Personalized, intelligent travel planning platform",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 gradient-text-coral">
          Traveloop
        </h1>
        <p className="text-text-muted text-lg md:text-xl mb-12">
          Plan your next adventure with AI-powered itinerary suggestions, budget tracking, and community inspiration
        </p>
        
        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <Link href="/login">
            <button className="px-8 py-3 bg-gradient-to-r from-accent-coral to-accent-gold rounded-lg font-bold text-bg-deep hover:shadow-glow-coral transition-all">
              Get Started
            </button>
          </Link>
          <Link href="/explore">
            <button className="px-8 py-3 border border-accent-teal text-accent-teal rounded-lg font-bold hover:shadow-glow-teal transition-all">
              Explore Trips
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
