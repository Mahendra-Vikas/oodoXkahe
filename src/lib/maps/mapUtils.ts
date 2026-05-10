// src/lib/maps/mapUtils.ts
import { MapStop, RouteInfo } from './types'

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 100) / 100
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`
  return `${km.toFixed(1)} km`
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/**
 * Get center coordinates of all stops
 */
export function getCenterCoordinates(stops: MapStop[]): { lat: number; lng: number } {
  if (stops.length === 0) return { lat: 20, lng: 0 }
  if (stops.length === 1) return { lat: stops[0].lat, lng: stops[0].lng }

  const sumLat = stops.reduce((sum, stop) => sum + stop.lat, 0)
  const sumLng = stops.reduce((sum, stop) => sum + stop.lng, 0)
  return {
    lat: sumLat / stops.length,
    lng: sumLng / stops.length,
  }
}

/**
 * Get zoom level that fits all stops
 */
export function getZoomLevel(stops: MapStop[]): number {
  if (stops.length === 0) return 3
  if (stops.length === 1) return 12

  const latitudes = stops.map((s) => s.lat)
  const longitudes = stops.map((s) => s.lng)

  const maxLat = Math.max(...latitudes)
  const minLat = Math.min(...latitudes)
  const maxLng = Math.max(...longitudes)
  const minLng = Math.min(...longitudes)

  const latRange = maxLat - minLat
  const lngRange = maxLng - minLng

  const maxRange = Math.max(latRange, lngRange)

  if (maxRange > 60) return 3
  if (maxRange > 30) return 4
  if (maxRange > 15) return 5
  if (maxRange > 7) return 6
  if (maxRange > 3) return 7
  if (maxRange > 1.5) return 8
  if (maxRange > 0.75) return 9
  if (maxRange > 0.375) return 10
  return 11
}

/**
 * Encode polyline (for storing route data)
 */
export function encodePolyline(points: { lat: number; lng: number }[]): string {
  if (!points.length) return ''
  // Simplified polyline encoding
  return JSON.stringify(points)
}

/**
 * Decode polyline
 */
export function decodePolyline(encoded: string): { lat: number; lng: number }[] {
  try {
    return JSON.parse(encoded)
  } catch {
    return []
  }
}

/**
 * Check if coordinates are valid
 */
export function isValidCoordinates(lat: number | null, lng: number | null): boolean {
  if (!lat || !lng) return false
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

/**
 * Get bounds for multiple locations
 */
export function getBounds(
  stops: MapStop[]
): google.maps.LatLngBounds | null {
  if (!window.google || stops.length === 0) return null

  const bounds = new google.maps.LatLngBounds()
  stops.forEach((stop) => {
    bounds.extend({ lat: stop.lat, lng: stop.lng })
  })
  return bounds
}

/**
 * Travel mode to icon
 */
export function getTravelModeIcon(mode: string): string {
  const icons: Record<string, string> = {
    DRIVING: '🚗',
    WALKING: '🚶',
    TRANSIT: '🚌',
    BICYCLING: '🚴',
    FLYING: '✈️',
    TRAIN: '🚆',
    BUS: '🚌',
  }
  return icons[mode] || '📍'
}

/**
 * Get marker color based on order
 */
export function getMarkerColor(index: number): string {
  const colors = [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#9400D3', // Violet
  ]
  return colors[index % colors.length]
}
