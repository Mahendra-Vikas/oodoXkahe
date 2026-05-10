// src/lib/maps/useDirections.ts
'use client'

import { useState, useCallback } from 'react'
import { RouteInfo } from './types'

interface DirectionsRequest {
  origin: { lat: number; lng: number }
  destination: { lat: number; lng: number }
  mode?: google.maps.TravelMode
  waypoints?: { lat: number; lng: number }[]
}

export function useDirections() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [route, setRoute] = useState<RouteInfo | null>(null)

  const getDirections = useCallback(
    async (request: DirectionsRequest): Promise<RouteInfo | null> => {
      if (!window.google) {
        setError('Google Maps not loaded')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const service = new google.maps.DirectionsService()

        const waypoints = (request.waypoints || []).map((wp) => ({
          location: new google.maps.LatLng(wp.lat, wp.lng),
          stopover: true,
        }))

        const result = await service.route({
          origin: new google.maps.LatLng(request.origin.lat, request.origin.lng),
          destination: new google.maps.LatLng(
            request.destination.lat,
            request.destination.lng
          ),
          waypoints,
          travelMode: request.mode || google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
        })

        if (result.routes.length === 0) {
          setError('No route found')
          return null
        }

        const route = result.routes[0]
        const leg = route.legs[0]

        const routeInfo: RouteInfo = {
          distance: leg.distance?.value ? leg.distance.value / 1000 : 0,
          duration: leg.duration?.value ? Math.ceil(leg.duration.value / 60) : 0,
          polyline: route.overview_polyline,
          startLocation: {
            lat: leg.start_location.lat(),
            lng: leg.start_location.lng(),
          },
          endLocation: {
            lat: leg.end_location.lat(),
            lng: leg.end_location.lng(),
          },
          steps: route.legs.flatMap((l) => l.steps),
        }

        setRoute(routeInfo)
        return routeInfo
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to get directions'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { getDirections, route, loading, error }
}
