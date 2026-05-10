import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { generateItinerarySuggestion, askGroq } from '@/lib/groq'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  
  if (body.type === 'itinerary') {
    const result = await generateItinerarySuggestion({
      destination: body.destination,
      days: body.days,
      budget: body.budget,
      interests: body.interests || [],
    })
    return NextResponse.json(result)
  }

  if (body.type === 'chat') {
    const response = await askGroq(body.message)
    return NextResponse.json({ response })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
