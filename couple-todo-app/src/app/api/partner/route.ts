import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        partnerCode: true,
        partner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('GET /api/partner error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (action === 'generate') {
      const partnerCode = crypto.randomBytes(6).toString('hex')
      
      const updatedUser = await prisma.user.update({
        where: { email: session.user.email },
        data: { partnerCode },
      })

      return NextResponse.json({ partnerCode: updatedUser.partnerCode })
    } else if (action === 'connect') {
      const { partnerCode } = await request.json()

      if (!partnerCode) {
        return NextResponse.json(
          { message: 'Partner code is required' },
          { status: 400 }
        )
      }

      const partner = await prisma.user.findUnique({
        where: { partnerCode },
      })

      if (!partner) {
        return NextResponse.json(
          { message: 'Invalid partner code' },
          { status: 400 }
        )
      }

      if (partner.id === currentUser.id) {
        return NextResponse.json(
          { message: 'Cannot connect with yourself' },
          { status: 400 }
        )
      }

      if (partner.partnerId || currentUser.partnerId) {
        return NextResponse.json(
          { message: 'One or both users are already connected' },
          { status: 400 }
        )
      }

      // Connect both users
      await prisma.$transaction([
        prisma.user.update({
          where: { id: currentUser.id },
          data: { partnerId: partner.id },
        }),
        prisma.user.update({
          where: { id: partner.id },
          data: { partnerId: currentUser.id },
        }),
      ])

      return NextResponse.json({ message: 'Successfully connected with partner' })
    } else if (action === 'disconnect') {
      if (!currentUser.partnerId) {
        return NextResponse.json(
          { message: 'Not connected with any partner' },
          { status: 400 }
        )
      }

      // Disconnect both users
      await prisma.$transaction([
        prisma.user.update({
          where: { id: currentUser.id },
          data: { partnerId: null, partnerCode: null },
        }),
        prisma.user.update({
          where: { id: currentUser.partnerId },
          data: { partnerId: null, partnerCode: null },
        }),
      ])

      return NextResponse.json({ message: 'Successfully disconnected from partner' })
    }

    return NextResponse.json(
      { message: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('POST /api/partner error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 