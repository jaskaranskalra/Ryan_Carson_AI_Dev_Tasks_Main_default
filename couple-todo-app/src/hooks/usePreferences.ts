import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import type { UserPreferences } from '@/types/preferences'
import { defaultPreferences } from '@/types/preferences'

export function usePreferences() {
  const { status } = useSession()
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPreferences()
    }
  }, [status])

  const fetchPreferences = async () => {
    try {
      setError(null)
      const response = await fetch('/api/preferences')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch preferences')
      }

      setPreferences(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch preferences')
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    try {
      setError(null)
      const response = await fetch('/api/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreferences),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update preferences')
      }

      setPreferences(data)
      return true
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update preferences')
      return false
    }
  }, [])

  const resetPreferences = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultPreferences),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset preferences')
      }

      setPreferences(data)
      return true
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reset preferences')
      return false
    }
  }, [])

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    resetPreferences,
  }
} 