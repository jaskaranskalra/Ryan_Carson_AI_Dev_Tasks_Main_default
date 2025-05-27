import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '../ThemeToggle'
import '@testing-library/jest-dom'

jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    setTheme: jest.fn(),
  })),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Clear any previous renders
    jest.clearAllMocks()
  })

  it('renders without crashing', async () => {
    render(<ThemeToggle />)

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle theme/i })
      expect(button).toBeInTheDocument()
    })
  })

  it('displays the moon icon in light mode', async () => {
    render(<ThemeToggle />)

    await waitFor(() => {
      const moonIcon = screen.getByTestId('moon-icon')
      expect(moonIcon).toBeInTheDocument()
    })
  })

  it('toggles theme when clicked', async () => {
    const { rerender } = render(<ThemeToggle />)
    const user = userEvent.setup()

    // Wait for component to mount
    await waitFor(() => {
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    })

    // Click the toggle button
    const button = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(button)

    // Force a rerender with the new theme
    rerender(<ThemeToggle />)

    // Wait for the theme to change
    await waitFor(() => {
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    })
  })

  it('returns null when not mounted', () => {
    // Mock useEffect to prevent mounting
    jest.spyOn(React, 'useEffect').mockImplementationOnce(() => {})

    const { container } = render(<ThemeToggle />)
    expect(container.firstChild).toBeNull()
  })
})
