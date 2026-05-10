'use client'

export default function CommunityPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Community</h1>
        <p className="text-text-muted">Share trips and get inspired by other travelers</p>
      </div>

      <div className="glass-card p-12 text-center">
        <p className="text-text-muted text-lg mb-4">No community posts yet</p>
        <p className="text-text-muted">Share your trip to inspire others!</p>
      </div>
    </div>
  )
}
