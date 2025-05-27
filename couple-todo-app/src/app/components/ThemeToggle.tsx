import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="toggle theme"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5" data-testid="sun-icon" />
      ) : (
        <MoonIcon className="h-5 w-5" data-testid="moon-icon" />
      )}
    </button>
  )
}
