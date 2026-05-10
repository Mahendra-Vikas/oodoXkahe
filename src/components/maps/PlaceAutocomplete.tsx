'use client'
import { useEffect, useRef } from 'react'
import { getGoogleMapsLoader } from '@/lib/googleMaps'

interface PlaceResult {
  cityName: string
  country: string
  lat: number
  lng: number
}

export function PlaceAutocomplete({
  onSelect,
  placeholder = 'Search for a city...',
}: {
  onSelect: (place: PlaceResult) => void
  placeholder?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getGoogleMapsLoader()
      .load()
      .then(() => {
        if (!inputRef.current) return

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['(cities)'],
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (!place.geometry?.location) return

          const countryComponent = place.address_components?.find(c =>
            c.types.includes('country')
          )

          onSelect({
            cityName: place.name || '',
            country: countryComponent?.long_name || '',
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          })
        })
      })
  }, [onSelect])

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl text-white outline-none transition-all"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#F0F4FF',
      }}
      onFocus={e => (e.target.style.borderColor = '#00E5CC')}
      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
    />
  )
}
