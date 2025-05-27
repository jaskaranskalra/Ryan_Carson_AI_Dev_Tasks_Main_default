import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { defaultPreferences } from '@/types/preferences'
import type { UserPreferences } from '@/types/preferences'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { preferences: true },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const preferences = user.preferences as UserPreferences || defaultPreferences

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('GET /api/preferences error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const preferences = await request.json()

    // Validate preferences structure
    const requiredKeys = ['theme', 'notifications', 'privacy', 'display', 'dateTime']
    const hasAllKeys = requiredKeys.every(key => key in preferences)

    if (!hasAllKeys) {
      return NextResponse.json(
        { message: 'Invalid preferences format' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { preferences },
      select: { preferences: true },
    })

    return NextResponse.json(updatedUser.preferences)
  } catch (error) {
    console.error('PUT /api/preferences error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { preferences: true },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const currentPreferences = user.preferences as UserPreferences || defaultPreferences
    const updatedPreferences = { ...currentPreferences, ...updates }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { preferences: updatedPreferences },
      select: { preferences: true },
    })

    return NextResponse.json(updatedUser.preferences)
  } catch (error) {
    console.error('PATCH /api/preferences error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 