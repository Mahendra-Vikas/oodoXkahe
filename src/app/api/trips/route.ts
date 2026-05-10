import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const trips = await prisma.trip.findMany({
    where: { userId, ...(status ? { status: status as any } : {}) },
    include: {
      stops: { include: { activities: true } },
      expenses: true,
      _count: { select: { stops: true, notes: true } },
    },
    orderBy: { startDate: 'asc' },
  })
  return NextResponse.json(trips)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const body = await req.json()

  const trip = await prisma.trip.create({
    data: {
      userId,
      title: body.title,
      description: body.description,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      totalBudget: body.totalBudget ? parseFloat(body.totalBudget) : null,
      currency: body.currency || 'USD',
      coverImage: body.coverImage,
      isPublic: body.isPublic || false,
    },
  })
  return NextResponse.json(trip, { status: 201 })
}
