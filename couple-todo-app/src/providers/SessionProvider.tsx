'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { usePreferences } from '@/hooks/usePreferences'
import { createContext, useContext, useEffect } from 'react'
import type { UserPreferences } from '@/types/preferences'

interface SessionContextValue {
  preferences: UserPreferences
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<boolean>
  resetPreferences: () => Promise<boolean>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

interface SessionProviderProps {
  children: React.ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const {
    preferences,
    updatePreferences,
    resetPreferences,
  } = usePreferences()

  // Apply theme preference
  useEffect(() => {
    const root = window.document.documentElement
    const isDark = preferences.theme === 'dark' ||
      (preferences.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)

    root.classList.toggle('dark', isDark)
  }, [preferences.theme])

  const contextValue: SessionContextValue = {
    preferences,
    updatePreferences,
    resetPreferences,
  }

  return (
    <NextAuthSessionProvider>
      <SessionContext.Provider value={contextValue}>
        {children}
      </SessionContext.Provider>
    </NextAuthSessionProvider>
  )
} 