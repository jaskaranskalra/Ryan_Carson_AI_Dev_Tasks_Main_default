import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskInput } from '../TaskInput'

describe('TaskInput', () => {
  const mockOnTaskAdd = jest.fn()

  beforeEach(() => {
    mockOnTaskAdd.mockClear()
  })

  it('renders with default placeholder', () => {
    render(<TaskInput onTaskAdd={mockOnTaskAdd} />)

    const input = screen.getByPlaceholderText('Add a new task...')
    expect(input).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<TaskInput onTaskAdd={mockOnTaskAdd} placeholder="Custom placeholder" />)

    const input = screen.getByPlaceholderText('Custom placeholder')
    expect(input).toBeInTheDocument()
  })

  it('calls onTaskAdd when clicking add button with non-empty input', async () => {
    render(<TaskInput onTaskAdd={mockOnTaskAdd} />)
    const user = userEvent.setup()

    const input = screen.getByTestId('task-input')
    const addButton = screen.getByRole('button', { name: /add task/i })

    // Button should be disabled initially
    expect(addButton).toBeDisabled()

    // Type text and verify button is enabled
    await user.type(input, 'New task')
    expect(addButton).toBeEnabled()

    // Click button and verify onTaskAdd is called
    await user.click(addButton)
    expect(mockOnTaskAdd).toHaveBeenCalledWith('New task')

    // Input should be cleared
    expect(input).toHaveValue('')
  })

  it('calls onTaskAdd when pressing Enter with non-empty input', async () => {
    render(<TaskInput onTaskAdd={mockOnTaskAdd} />)
    const user = userEvent.setup()

    const input = screen.getByTestId('task-input')

    // Type text and press Enter
    await user.type(input, 'New task{Enter}')

    expect(mockOnTaskAdd).toHaveBeenCalledWith('New task')
    expect(input).toHaveValue('')
  })

  it('does not call onTaskAdd with empty input', async () => {
    render(<TaskInput onTaskAdd={mockOnTaskAdd} />)
    const user = userEvent.setup()

    const input = screen.getByTestId('task-input')
    const addButton = screen.getByRole('button', { name: /add task/i })

    // Try with empty input
    await user.click(addButton)
    expect(mockOnTaskAdd).not.toHaveBeenCalled()

    // Try with whitespace
    await user.type(input, '   ')
    await user.click(addButton)
    expect(mockOnTaskAdd).not.toHaveBeenCalled()

    // Try pressing Enter with empty input
    await user.type(input, '{Enter}')
    expect(mockOnTaskAdd).not.toHaveBeenCalled()
  })

  it('trims whitespace from input', async () => {
    render(<TaskInput onTaskAdd={mockOnTaskAdd} />)
    const user = userEvent.setup()

    const input = screen.getByTestId('task-input')

    // Type text with whitespace
    await user.type(input, '  New task  ')
    await user.type(input, '{Enter}')

    expect(mockOnTaskAdd).toHaveBeenCalledWith('New task')
  })
})
