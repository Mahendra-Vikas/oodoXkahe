'use client'
import { useEffect, useState } from 'react'
import { getWeatherByCity, WeatherData } from '@/lib/weather'

export function WeatherWidget({ city }: { city: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!city) return
    getWeatherByCity(city)
      .then(setWeather)
      .finally(() => setLoading(false))
  }, [city])

  if (loading) {
    return (
      <div className="rounded-xl p-4 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="h-4 w-24 rounded mb-2" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="h-8 w-16 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>
    )
  }

  if (!weather) return null

  const weatherIcons: Record<string, string> = {
    '01': '☀️', '02': '⛅', '03': '☁️', '04': '☁️',
    '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '❄️', '50': '🌫️'
  }
  const iconCode = weather.icon.slice(0, 2)
  const emoji = weatherIcons[iconCode] || '🌡️'

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: 'rgba(0,229,204,0.05)',
        border: '1px solid rgba(0,229,204,0.15)',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs mb-1" style={{ color: '#6B7A9F' }}>
            {weather.cityName}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold" style={{ color: '#00E5CC', fontFamily: 'Space Mono' }}>
              {weather.temp}°C
            </span>
            <span className="text-lg mb-1">{emoji}</span>
          </div>
          <p className="text-xs capitalize mt-1" style={{ color: '#6B7A9F' }}>
            {weather.description}
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs" style={{ color: '#6B7A9F' }}>
            💧 {weather.humidity}%
          </p>
          <p className="text-xs" style={{ color: '#6B7A9F' }}>
            💨 {Math.round(weather.windSpeed)} m/s
          </p>
          <p className="text-xs" style={{ color: '#6B7A9F' }}>
            Feels {weather.feelsLike}°C
          </p>
        </div>
      </div>
    </div>
  )
}
