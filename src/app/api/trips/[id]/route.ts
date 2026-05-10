import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

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

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: userId,
      },
      include: {
        stops: {
          include: {
            activities: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
        expenses: {
          orderBy: { date: 'desc' },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            stops: true,
            expenses: true,
            notes: true,
          },
        },
      },
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(trip)
  } catch (error: any) {
    console.error('Error fetching trip:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trip' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const existingTrip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    })

    if (!existingTrip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        title: body.title || existingTrip.title,
        description: body.description,
        startDate: body.startDate ? new Date(body.startDate) : existingTrip.startDate,
        endDate: body.endDate ? new Date(body.endDate) : existingTrip.endDate,
        totalBudget: body.totalBudget ? parseFloat(body.totalBudget) : existingTrip.totalBudget,
        currency: body.currency || existingTrip.currency,
        coverImage: body.coverImage || existingTrip.coverImage,
        isPublic: body.isPublic !== undefined ? body.isPublic : existingTrip.isPublic,
      },
      include: {
        stops: { include: { activities: true } },
        expenses: true,
      },
    })

    return NextResponse.json(updatedTrip)
  } catch (error: any) {
    console.error('Error updating trip:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update trip' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    // Delete related data
    await prisma.activity.deleteMany({
      where: {
        stop: {
          tripId: tripId,
        },
      },
    })

    await prisma.tripStop.deleteMany({
      where: { tripId },
    })

    await prisma.expense.deleteMany({
      where: { tripId },
    })

    await prisma.tripNote.deleteMany({
      where: { tripId },
    })

    await prisma.trip.delete({
      where: { id: tripId },
    })

    return NextResponse.json({ message: 'Trip deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting trip:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete trip' },
      { status: 500 }
    )
  }
}
