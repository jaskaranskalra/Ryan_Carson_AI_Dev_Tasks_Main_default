import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        avatar: true,
        bio: true,
        timezone: true,
        partnerCode: true,
        partnerId: true,
        isOnboarded: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('GET /api/profile error:', error)
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

    const formData = await request.formData()
    const name = formData.get('name') as string
    const bio = formData.get('bio') as string
    const timezone = formData.get('timezone') as string
    const partnerCode = formData.get('partnerCode') as string
    const avatarFile = formData.get('avatar') as File | null

    let avatarUrl: string | undefined

    if (avatarFile) {
      const fileExtension = avatarFile.name.split('.').pop()
      const fileName = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`
      const contentType = avatarFile.type

      const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: `avatars/${fileName}`,
        ContentType: contentType,
      })

      const signedUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 3600 })
      
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: await avatarFile.arrayBuffer(),
        headers: {
          'Content-Type': contentType,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload avatar')
      }

      avatarUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/avatars/${fileName}`
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        bio,
        timezone,
        partnerCode,
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('PUT /api/profile error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 