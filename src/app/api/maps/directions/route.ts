// src/app/api/maps/directions/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { stops, travelMode = 'DRIVING' } = await req.json()

    if (!stops || stops.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 stops required' },
        { status: 400 }
      )
    }

    // Here you would call Google Directions API
    // For now, we'll return a mock response
    const routes = []
    for (let i = 0; i < stops.length - 1; i++) {
      routes.push({
        from: stops[i].city,
        to: stops[i + 1].city,
        distance: Math.random() * 500 + 50, // Mock: 50-550 km
        duration: Math.random() * 12 + 1, // Mock: 1-13 hours
        travelMode,
        polyline: '', // Should be encoded polyline from Google
      })
    }

    return NextResponse.json({ routes })
  } catch (error) {
    console.error('Directions API error:', error)
    return NextResponse.json(
      { error: 'Failed to get directions' },
      { status: 500 }
    )
  }
}
