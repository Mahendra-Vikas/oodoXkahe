import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { askGroq, generateTripSuggestion, generatePackingList } from '@/lib/groq'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    if (body.type === 'itinerary') {
      const result = await generateTripSuggestion({
        destination: body.destination,
        days: body.days || 3,
        budget: body.budget || 500,
        interests: body.interests || ['sightseeing', 'food'],
      })
      return NextResponse.json(result)
    }

    if (body.type === 'packing') {
      const result = await generatePackingList({
        destination: body.destination,
        days: body.days || 3,
        activities: body.activities || [],
      })
      return NextResponse.json(result)
    }

    if (body.type === 'chat') {
      const response = await askGroq(body.message)
      return NextResponse.json({ response })
    }

    return NextResponse.json({ error: 'Invalid type. Use: itinerary, packing, or chat' }, { status: 400 })
  } catch (error: any) {
    console.error('AI API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
