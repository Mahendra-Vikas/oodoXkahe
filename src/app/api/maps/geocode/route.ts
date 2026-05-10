// src/app/api/maps/geocode/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json()

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    // Call Google Geocoding API
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    )

    const data = await response.json()

    if (data.results.length === 0) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    const result = data.results[0]
    return NextResponse.json({
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      address: result.formatted_address,
      placeId: result.place_id,
    })
  } catch (error) {
    console.error('Geocode API error:', error)
    return NextResponse.json(
      { error: 'Failed to geocode address' },
      { status: 500 }
    )
  }
}
