// src/lib/maps/usePlacesSearch.ts
'use client'

import { useState, useCallback } from 'react'

export interface PlaceSearchResult {
  placeId: string
  name: string
  formattedAddress: string
  lat: number
  lng: number
  types: string[]
  rating?: number
  userRatingsTotal?: number
  photoUrl?: string
  website?: string
  phoneNumber?: string
  openingHours?: string[]
}

export function usePlacesSearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<PlaceSearchResult[]>([])

  const searchNearby = useCallback(
    async (
      location: { lat: number; lng: number },
      type: string, // 'tourist_attraction', 'restaurant', 'hotel', 'museum', 'beach'
      radius: number = 5000 // 5 km
    ): Promise<PlaceSearchResult[]> => {
      if (!window.google) {
        setError('Google Maps not loaded')
        return []
      }

      setLoading(true)
      setError(null)

      try {
        const service = new google.maps.places.PlacesService(
          document.createElement('div')
        )

        const request = {
          location: new google.maps.LatLng(location.lat, location.lng),
          radius,
          type,
        }

        return new Promise((resolve) => {
          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              const converted: PlaceSearchResult[] = results.map((place) => ({
                placeId: place.place_id || '',
                name: place.name || '',
                formattedAddress: place.vicinity || '',
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0,
                types: place.types || [],
                rating: place.rating,
                userRatingsTotal: place.user_ratings_total,
                photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400 }),
              }))
              setResults(converted)
              resolve(converted)
            } else {
              setError(`Search failed: ${status}`)
              resolve([])
            }
          })
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Search failed'
        setError(message)
        return []
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<PlaceSearchResult | null> => {
      if (!window.google) {
        setError('Google Maps not loaded')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const service = new google.maps.places.PlacesService(
          document.createElement('div')
        )

        return new Promise((resolve) => {
          service.getDetails(
            {
              placeId,
              fields: [
                'name',
                'formatted_address',
                'geometry',
                'rating',
                'user_ratings_total',
                'photos',
                'website',
                'formatted_phone_number',
                'opening_hours',
              ],
            },
            (place, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                const result: PlaceSearchResult = {
                  placeId: place.place_id || '',
                  name: place.name || '',
                  formattedAddress: place.formatted_address || '',
                  lat: place.geometry?.location?.lat() || 0,
                  lng: place.geometry?.location?.lng() || 0,
                  types: place.types || [],
                  rating: place.rating,
                  userRatingsTotal: place.user_ratings_total,
                  photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400 }),
                  website: place.website,
                  phoneNumber: place.formatted_phone_number,
                  openingHours: place.opening_hours?.weekday_text,
                }
                resolve(result)
              } else {
                setError(`Details request failed: ${status}`)
                resolve(null)
              }
            }
          )
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Details request failed'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { searchNearby, getPlaceDetails, results, loading, error }
}
