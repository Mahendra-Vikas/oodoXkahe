// src/components/maps/DestinationExplorer.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePlacesSearch } from '@/lib/maps/usePlacesSearch'
import { PlaceSearchResult } from '@/lib/maps/usePlacesSearch'
import { useGoogleMaps } from '@/lib/maps/useGoogleMaps'
import toast from 'react-hot-toast'

interface DestinationExplorerProps {
  lat: number
  lng: number
  cityName: string
}

type PlaceType = 'tourist_attraction' | 'restaurant' | 'hotel' | 'museum' | 'beach'

const PLACE_CATEGORIES: { label: string; type: PlaceType; icon: string }[] = [
  { label: 'Attractions', type: 'tourist_attraction', icon: '🏛️' },
  { label: 'Restaurants', type: 'restaurant', icon: '🍽️' },
  { label: 'Hotels', type: 'hotel', icon: '🏨' },
  { label: 'Museums', type: 'museum', icon: '🎨' },
  { label: 'Beaches', type: 'beach', icon: '🏖️' },
]

export function DestinationExplorer({ lat, lng, cityName }: DestinationExplorerProps) {
  const { isLoaded } = useGoogleMaps()
  const { searchNearby, getPlaceDetails, results, loading, error } = usePlacesSearch()
  const [selectedCategory, setSelectedCategory] = useState<PlaceType>('tourist_attraction')
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(null)
  const [radius, setRadius] = useState(5000)

  useEffect(() => {
    if (isLoaded) {
      handleSearch()
    }
  }, [selectedCategory, radius, isLoaded])

  const handleSearch = async () => {
    await searchNearby({ lat, lng }, selectedCategory, radius)
  }

  const handlePlaceClick = async (place: PlaceSearchResult) => {
    const details = await getPlaceDetails(place.placeId)
    setSelectedPlace(details || place)
  }

  if (!isLoaded) {
    return (
      <div className="text-center py-8 text-text-secondary">
        Loading map data...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Category Buttons */}
      <div className="flex gap-2 flex-wrap">
        {PLACE_CATEGORIES.map((cat) => (
          <button
            key={cat.type}
            onClick={() => {
              setSelectedCategory(cat.type)
              setSelectedPlace(null)
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === cat.type
                ? 'bg-accent-teal text-text-primary'
                : 'bg-bg-deep border border-accent-teal/30 text-text-secondary hover:border-accent-teal'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Radius Slider */}
      <div className="space-y-2">
        <label className="text-text-secondary text-sm">
          Search Radius: {radius / 1000} km
        </label>
        <input
          type="range"
          min="1000"
          max="20000"
          step="1000"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full accent-accent-teal"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-600 text-red-100 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {results.map((place) => (
          <button
            key={place.placeId}
            onClick={() => handlePlaceClick(place)}
            className={`p-4 rounded-lg text-left border-2 transition ${
              selectedPlace?.placeId === place.placeId
                ? 'border-accent-teal bg-bg-deep'
                : 'border-bg-light bg-bg-light/30 hover:border-accent-teal'
            }`}
          >
            {place.photoUrl && (
              <img
                src={place.photoUrl}
                alt={place.name}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-semibold text-text-primary text-sm">{place.name}</h3>
            <p className="text-xs text-text-secondary">{place.formattedAddress}</p>
            {place.rating && (
              <div className="mt-2 flex items-center gap-1 text-xs text-accent-teal">
                ⭐ {place.rating} ({place.userRatingsTotal} reviews)
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selected Place Details */}
      {selectedPlace && (
        <div className="bg-bg-deep border border-accent-teal rounded-lg p-4 space-y-3">
          <h2 className="text-lg font-bold text-text-primary">{selectedPlace.name}</h2>
          <p className="text-sm text-text-secondary">{selectedPlace.formattedAddress}</p>

          {selectedPlace.photoUrl && (
            <img
              src={selectedPlace.photoUrl}
              alt={selectedPlace.name}
              className="w-full h-40 object-cover rounded-lg"
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            {selectedPlace.rating && (
              <div className="bg-bg-light p-2 rounded">
                <p className="text-xs text-text-secondary">Rating</p>
                <p className="text-sm font-semibold text-accent-teal">⭐ {selectedPlace.rating}</p>
              </div>
            )}
            {selectedPlace.phoneNumber && (
              <div className="bg-bg-light p-2 rounded">
                <p className="text-xs text-text-secondary">Phone</p>
                <p className="text-sm font-semibold text-text-primary">{selectedPlace.phoneNumber}</p>
              </div>
            )}
          </div>

          {selectedPlace.website && (
            <a
              href={selectedPlace.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-accent-teal hover:underline text-sm"
            >
              Visit Website ↗
            </a>
          )}

          <button
            onClick={() => toast.success('Added to trip!')}
            className="w-full bg-accent-teal text-text-primary py-2 rounded-lg font-medium hover:bg-accent-teal/90 transition"
          >
            Add to Activities
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4 text-text-secondary">
          Searching nearby places...
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && !error && (
        <div className="text-center py-8 text-text-secondary">
          No places found for this category
        </div>
      )}
    </div>
  )
}
