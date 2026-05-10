// src/lib/maps/types.ts

export interface MapStop {
  id: string
  city: string
  country: string
  lat: number
  lng: number
  placeId?: string
  startDate: Date
  endDate: Date
  orderIndex: number
  distanceTo?: number
  durationTo?: number
  travelMode?: 'DRIVING' | 'WALKING' | 'TRANSIT' | 'BICYCLING' | 'FLYING' | 'TRAIN' | 'BUS'
  routeData?: string
  activities?: MapActivity[]
}

export interface MapActivity {
  id: string
  name: string
  description?: string
  category?: string
  cost?: number
  lat?: number
  lng?: number
  location?: string
}

export interface RouteInfo {
  distance: number // in km
  duration: number // in minutes
  polyline: string
  startLocation: { lat: number; lng: number }
  endLocation: { lat: number; lng: number }
  steps: google.maps.DirectionsStep[]
}

export interface MarkerConfig {
  title: string
  position: { lat: number; lng: number }
  color?: string
  label?: string | number
  icon?: string
  onClick?: () => void
}

export interface MapState {
  center: { lat: number; lng: number }
  zoom: number
  markers: MarkerConfig[]
  polylines: google.maps.PolylineOptions[]
  selectedMarker: MarkerConfig | null
}
