// src/lib/maps/mapStore.ts
import { create } from 'zustand'
import { MapStop, MarkerConfig } from './types'

interface MapStoreState {
  stops: MapStop[]
  selectedStop: MapStop | null
  selectedMarker: MarkerConfig | null
  center: { lat: number; lng: number }
  zoom: number
  showWeather: boolean
  showBudget: boolean
  animatingRoute: boolean
  currentDay: number
  
  // Actions
  setStops: (stops: MapStop[]) => void
  setSelectedStop: (stop: MapStop | null) => void
  setSelectedMarker: (marker: MarkerConfig | null) => void
  setCenter: (lat: number, lng: number, zoom?: number) => void
  setShowWeather: (show: boolean) => void
  setShowBudget: (show: boolean) => void
  setAnimatingRoute: (animating: boolean) => void
  setCurrentDay: (day: number) => void
  reset: () => void
}

const initialState = {
  stops: [],
  selectedStop: null,
  selectedMarker: null,
  center: { lat: 20, lng: 0 },
  zoom: 3,
  showWeather: true,
  showBudget: false,
  animatingRoute: false,
  currentDay: 0,
}

export const useMapStore = create<MapStoreState>((set) => ({
  ...initialState,
  
  setStops: (stops) => set({ stops }),
  setSelectedStop: (stop) => set({ selectedStop: stop }),
  setSelectedMarker: (marker) => set({ selectedMarker: marker }),
  setCenter: (lat, lng, zoom) => set({ 
    center: { lat, lng },
    zoom: zoom || 12,
  }),
  setShowWeather: (show) => set({ showWeather: show }),
  setShowBudget: (show) => set({ showBudget: show }),
  setAnimatingRoute: (animating) => set({ animatingRoute: animating }),
  setCurrentDay: (day) => set({ currentDay: day }),
  reset: () => set(initialState),
}))
