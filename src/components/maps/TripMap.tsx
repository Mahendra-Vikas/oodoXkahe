'use client'
import { useEffect, useRef } from 'react'
import { getGoogleMapsLoader } from '@/lib/googleMaps'

interface Stop {
  lat: number
  lng: number
  cityName: string
  orderIndex: number
}

export function TripMap({ stops }: { stops: Stop[] }) {
  const mapRef = useRef<HTMLDivElement>(null)

  const DARK_MAP_STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#0D1628' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#070B14' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#6B7A9F' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9da5b3' }] },
    { featureType: 'landscape', stylers: [{ color: '#0a1420' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2744' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#6B7A9F' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#060d1a' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d4f6e' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  ]

  useEffect(() => {
    if (!mapRef.current || stops.length === 0) return

    const validStops = stops.filter(s => s.lat && s.lng)
    if (validStops.length === 0) return

    getGoogleMapsLoader()
      .load()
      .then(() => {
        const map = new google.maps.Map(mapRef.current!, {
          zoom: validStops.length === 1 ? 10 : 4,
          center: { lat: validStops[0].lat, lng: validStops[0].lng },
          styles: DARK_MAP_STYLE,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        // Auto-fit bounds if multiple stops
        if (validStops.length > 1) {
          const bounds = new google.maps.LatLngBounds()
          validStops.forEach(s => bounds.extend({ lat: s.lat, lng: s.lng }))
          map.fitBounds(bounds, 80)
        }

        // Custom markers
        validStops.forEach((stop, idx) => {
          const marker = new google.maps.Marker({
            position: { lat: stop.lat, lng: stop.lng },
            map,
            title: stop.cityName,
            label: {
              text: String(idx + 1),
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: '13px',
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 18,
              fillColor: '#FF6B6B',
              fillOpacity: 1,
              strokeColor: '#FFB830',
              strokeWeight: 2,
            },
          })

          // Info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="background:#0D1628;color:#F0F4FF;padding:10px 14px;border-radius:8px;font-family:sans-serif;">
                <p style="font-weight:bold;margin:0;color:#FF6B6B;">Stop ${idx + 1}</p>
                <p style="margin:4px 0 0;font-size:14px;">${stop.cityName}</p>
              </div>
            `,
          })
          marker.addListener('click', () => infoWindow.open(map, marker))
        })

        // Route polyline
        if (validStops.length > 1) {
          new google.maps.Polyline({
            path: validStops.map(s => ({ lat: s.lat, lng: s.lng })),
            geodesic: true,
            strokeColor: '#00E5CC',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            map,
          })
        }
      })
      .catch(err => console.error('Google Maps load error:', err))
  }, [stops])

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl"
      style={{ minHeight: '350px' }}
    />
  )
}
