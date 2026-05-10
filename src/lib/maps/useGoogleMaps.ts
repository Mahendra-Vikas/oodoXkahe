// src/lib/maps/useGoogleMaps.ts
'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

let loaderInstance: Loader | null = null
let mapsLoaded = false

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(mapsLoaded)
  const [error, setError] = useState<string | null>(null)

  const loadMaps = useCallback(async () => {
    if (mapsLoaded) {
      setIsLoaded(true)
      return
    }

    try {
      if (!loaderInstance) {
        loaderInstance = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places', 'geometry', 'routes'],
        })
      }

      await loaderInstance.load()
      mapsLoaded = true
      setIsLoaded(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load Google Maps'
      setError(message)
      console.error('Google Maps Error:', message)
    }
  }, [])

  useEffect(() => {
    loadMaps()
  }, [loadMaps])

  return { isLoaded, error, google: typeof window !== 'undefined' ? (window as any).google : null }
}
