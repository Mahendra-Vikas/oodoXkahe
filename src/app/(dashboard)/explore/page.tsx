'use client'

export default function ExplorePage() {
  const destinations = [
    { name: 'Tokyo, Japan', image: '🗾' },
    { name: 'Paris, France', image: '🗼' },
    { name: 'Bali, Indonesia', image: '🏝️' },
    { name: 'New York, USA', image: '🗽' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Explore Destinations</h1>
        <p className="text-text-muted">Discover amazing places and get inspired</p>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search destinations..."
          className="w-full px-6 py-3 bg-bg-card border border-text-muted/20 rounded-lg text-text-primary focus:outline-none focus:border-accent-teal placeholder-text-muted"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {destinations.map((dest) => (
          <div key={dest.name} className="glass-card p-6 hover:border-accent-teal transition-colors cursor-pointer">
            <div className="text-5xl mb-3">{dest.image}</div>
            <p className="font-bold text-text-primary">{dest.name}</p>
            <p className="text-sm text-text-muted">Popular destination</p>
          </div>
        ))}
      </div>
    </div>
  )
}
