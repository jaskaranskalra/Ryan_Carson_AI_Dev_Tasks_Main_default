import '@testing-library/jest-dom'

// Mock next-themes
let mockTheme = 'light'

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: jest.fn().mockImplementation((newTheme: string) => {
      mockTheme = newTheme
    }),
  }),
}))

// Reset theme before each test
beforeEach(() => {
  mockTheme = 'light'
})

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}))
