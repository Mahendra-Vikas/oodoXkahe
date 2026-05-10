import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { id: tripId } = await params
    const body = await req.json()

    const { city, country, lat, lng, startDate, endDate } = body

    // Validate required fields
    if (!city || !tripId) {
      return NextResponse.json(
        { error: 'City and trip ID are required' },
        { status: 400 }
      )
    }

    // Check if trip exists and belongs to user
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: userId,
      },
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    // Get the current order index (add 1 to the highest existing index)
    const lastStop = await prisma.tripStop.findFirst({
      where: { tripId },
      orderBy: { orderIndex: 'desc' },
    })

    const orderIndex = (lastStop?.orderIndex ?? -1) + 1

    // Create the stop
    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        city,
        country: country || '',
        latitude: lat ? parseFloat(lat) : null,
        longitude: lng ? parseFloat(lng) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        orderIndex,
      },
      include: {
        activities: true,
      },
    })

    return NextResponse.json(stop, { status: 201 })
  } catch (error) {
    console.error('Error creating stop:', error)
    return NextResponse.json(
      { error: 'Failed to create stop' },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { id: tripId } = await params

    // Check if trip exists and belongs to user
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: userId,
      },
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    // Get all stops for this trip
    const stops = await prisma.tripStop.findMany({
      where: { tripId },
      include: {
        activities: true,
      },
      orderBy: { orderIndex: 'asc' },
    })

    return NextResponse.json(stops)
  } catch (error) {
    console.error('Error fetching stops:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stops' },
      { status: 500 }
    )
  }
}
