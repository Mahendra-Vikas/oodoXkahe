// src/components/maps/InteractiveTripMap.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useGoogleMaps } from '@/lib/maps/useGoogleMaps'
import { MapStop } from '@/lib/maps/types'
import {
  getCenterCoordinates,
  getZoomLevel,
  getMarkerColor,
  formatDistance,
} from '@/lib/maps/mapUtils'
import { useMapStore } from '@/lib/maps/mapStore'

interface InteractiveTripMapProps {
  stops: MapStop[]
  onStopClick?: (stop: MapStop) => void
  showWeather?: boolean
  showBudget?: boolean
  height?: string
}

export function InteractiveTripMap({
  stops,
  onStopClick,
  showWeather = true,
  showBudget = false,
  height = '500px',
}: InteractiveTripMapProps) {
  const { isLoaded, error, google } = useGoogleMaps()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markers = useRef<google.maps.Marker[]>([])
  const polylines = useRef<google.maps.Polyline[]>([])
  const infoWindows = useRef<google.maps.InfoWindow[]>([])
  
  const { selectedStop, setSelectedStop } = useMapStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !google || stops.length === 0) return

    setLoading(true)

    // Initialize map
    const center = getCenterCoordinates(stops)
    const zoom = getZoomLevel(stops)

    mapInstance.current = new google.maps.Map(mapRef.current, {
      zoom,
      center,
      mapTypeId: 'roadmap',
      styles: [
        {
          elementType: 'geometry',
          stylers: [{ color: '#1a1a1a' }],
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#1a1a1a' }],
        },
        {
          elementType: 'labels.text.fill',
          stylers: [{ color: '#bdbdbd' }],
        },
      ],
    })

    // Clear existing markers and polylines
    markers.current.forEach((m) => m.setMap(null))
    polylines.current.forEach((p) => p.setMap(null))
    infoWindows.current.forEach((w) => w.close())
    markers.current = []
    polylines.current = []
    infoWindows.current = []

    // Add markers for each stop
    stops.forEach((stop, index) => {
      const marker = new google.maps.Marker({
        position: { lat: stop.lat, lng: stop.lng },
        map: mapInstance.current,
        title: `${index + 1}. ${stop.city}`,
        label: {
          text: String(index + 1),
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: getMarkerColor(index),
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      })

      // Create info window content
      const content = `
        <div class="p-4 text-sm" style="max-width: 250px;">
          <h3 class="font-bold text-lg">${index + 1}. ${stop.city}</h3>
          <p class="text-gray-600">${stop.country}</p>
          <p class="mt-2 text-xs text-gray-500">
            ${new Date(stop.startDate).toLocaleDateString()} - ${new Date(stop.endDate).toLocaleDateString()}
          </p>
          ${stop.distanceTo ? `<p class="text-xs text-accent-teal mt-1">📍 ${formatDistance(stop.distanceTo)} to next</p>` : ''}
          ${stop.activities && stop.activities.length > 0 ? `<p class="text-xs mt-2">🎯 ${stop.activities.length} activities</p>` : ''}
        </div>
      `

      const infoWindow = new google.maps.InfoWindow({ content })
      infoWindows.current.push(infoWindow)

      marker.addListener('click', () => {
        // Close all other info windows
        infoWindows.current.forEach((w) => w.close())
        infoWindow.open(mapInstance.current, marker)
        setSelectedStop(stop)
        onStopClick?.(stop)
      })

      markers.current.push(marker)
    })

    // Draw polylines connecting stops
    if (stops.length > 1) {
      for (let i = 0; i < stops.length - 1; i++) {
        const line = new google.maps.Polyline({
          path: [
            { lat: stops[i].lat, lng: stops[i].lng },
            { lat: stops[i + 1].lat, lng: stops[i + 1].lng },
          ],
          geodesic: true,
          strokeColor: '#00d4d4',
          strokeOpacity: 0.7,
          strokeWeight: 2,
          map: mapInstance.current,
        })
        polylines.current.push(line)
      }
    }

    setLoading(false)
  }, [isLoaded, stops, google, onStopClick, setSelectedStop])

  if (error) {
    return (
      <div className={`bg-red-900 border border-red-600 text-red-100 p-4 rounded-lg`} style={{ height }}>
        <p className="font-semibold">Map Error</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      className="rounded-lg overflow-hidden border border-accent-teal/20"
      style={{
        height,
        opacity: loading ? 0.5 : 1,
        transition: 'opacity 0.3s',
      }}
    />
  )
}
