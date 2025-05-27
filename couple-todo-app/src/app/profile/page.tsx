'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { OptimizedImage } from '@/components/OptimizedImage'
import { PartnerConnect } from '@/components/PartnerConnect'
import { TimeZoneInfo } from '@/components/TimeZoneInfo'

interface ProfileFormData {
  name: string
  bio: string
  timezone: string
  partnerCode: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bio: '',
    timezone: '',
    partnerCode: '',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [partnerTimeZone, setPartnerTimeZone] = useState<string>('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && session?.user?.id) {
      fetchProfile()
      fetchPartnerTimeZone()
    }
  }, [status, session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile')
      }

      setFormData({
        name: data.name || '',
        bio: data.bio || '',
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        partnerCode: data.partnerCode || '',
      })
      setAvatarPreview(data.avatar || '')
    } catch (error) {
      setError('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPartnerTimeZone = async () => {
    try {
      const response = await fetch('/api/partner')
      const data = await response.json()

      if (response.ok && data.partner) {
        setPartnerTimeZone(data.partner.timezone)
      }
    } catch (error) {
      console.error('Failed to fetch partner time zone:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })
      if (avatar) {
        formDataToSend.append('avatar', avatar)
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      setSuccess('Profile updated successfully')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Profile Settings</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative h-24 w-24 rounded-full overflow-hidden">
                  {avatarPreview ? (
                    <OptimizedImage
                      src={avatarPreview}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    dark:file:bg-blue-900 dark:file:text-blue-200
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                />
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
              />
            </div>

            {/* Bio Field */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>

            {/* Timezone Field */}
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Timezone
              </label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                {Intl.supportedValuesOf('timeZone').map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            {/* Partner Code Field */}
            <div>
              <label htmlFor="partnerCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Partner Code
              </label>
              <input
                type="text"
                id="partnerCode"
                value={formData.partnerCode}
                onChange={(e) => setFormData({ ...formData, partnerCode: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Enter your partner's code to connect"
              />
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="text-red-500 dark:text-red-400 text-sm" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 dark:text-green-400 text-sm" role="alert">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        <TimeZoneInfo userTimeZone={formData.timezone} partnerTimeZone={partnerTimeZone} />
        <PartnerConnect />
      </div>
    </div>
  )
} 