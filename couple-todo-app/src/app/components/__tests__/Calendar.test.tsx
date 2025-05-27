import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calendar } from '../Calendar'
import { Task } from '@/lib/models/Task'
import { format, addMonths, subMonths } from 'date-fns'

describe('Calendar', () => {
  const mockOnDateSelect = jest.fn()
  const mockOnMonthChange = jest.fn()
  const baseDate = new Date('2024-03-15T12:00:00Z') // Using a fixed date for consistent testing

  const mockTasks: Task[] = [
    {
      id: '1',
      text: 'High priority task',
      completed: false,
      priority: 'high',
      createdAt: new Date('2024-03-15T12:00:00Z'),
    },
    {
      id: '2',
      text: 'Low priority task',
      completed: false,
      priority: 'low',
      createdAt: new Date('2024-03-15T14:00:00Z'),
    },
    {
      id: '3',
      text: 'Task for another day',
      completed: false,
      priority: 'medium',
      createdAt: new Date('2024-03-20T10:00:00Z'),
    },
  ]

  beforeEach(() => {
    mockOnDateSelect.mockClear()
    mockOnMonthChange.mockClear()
  })

  it('renders calendar with correct month and year', () => {
    render(
      <Calendar
        tasks={mockTasks}
        selectedDate={baseDate}
        onDateSelect={mockOnDateSelect}
        onMonthChange={mockOnMonthChange}
      />
    )

    expect(screen.getByText('March 2024')).toBeInTheDocument()
  })

  it('renders all days of the week', () => {
    render(
      <Calendar
        tasks={mockTasks}
        selectedDate={baseDate}
        onDateSelect={mockOnDateSelect}
        onMonthChange={mockOnMonthChange}
      />
    )

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    weekdays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument()
    })
  })

  it('shows task indicators on days with tasks', () => {
    render(
      <Calendar
        tasks={mockTasks}
        selectedDate={baseDate}
        onDateSelect={mockOnDateSelect}
        onMonthChange={mockOnMonthChange}
      />
    )

    // March 15 has two tasks (one high priority)
    const march15Button = screen.getByTestId('calendar-day-2024-03-15')
    const march15Indicator = march15Button.querySelector(
      '[data-testid="task-indicator-2024-03-15"]'
    )
    expect(march15Indicator).toHaveClass('bg-red-500') // High priority indicator

    // March 20 has one medium priority task
    const march20Button = screen.getByTestId('calendar-day-2024-03-20')
    const march20Indicator = march20Button.querySelector(
      '[data-testid="task-indicator-2024-03-20"]'
    )
    expect(march20Indicator).toHaveClass('bg-blue-500') // Normal priority indicator
  })

  it('calls onDateSelect when clicking a day', async () => {
    render(
      <Calendar
        tasks={mockTasks}
        selectedDate={baseDate}
        onDateSelect={mockOnDateSelect}
        onMonthChange={mockOnMonthChange}
      />
    )

    const user = userEvent.setup()
    const dayButton = screen.getByTestId('calendar-day-2024-03-20')
    await user.click(dayButton)

    expect(mockOnDateSelect).toHaveBeenCalledWith(expect.any(Date))
    const calledDate = mockOnDateSelect.mock.calls[0][0]
    expect(format(calledDate, 'yyyy-MM-dd')).toBe('2024-03-20')
  })

  it('navigates to previous month', async () => {
    render(
      <Calendar
        tasks={mockTasks}
        selectedDate={baseDate}
        onDateSelect={mockOnDateSelect}
        onMonthChange={mockOnMonthChange}
      />
    )

    const user = userEvent.setup()
    const prevButton = screen.getByTestId('prev-month-button')
    await user.click(prevButton)

    expect(mockOnMonthChange).toHaveBeenCalledWith(expect.any(Date))
    const calledDate = mockOnMonthChange.mock.calls[0][0]
    expect(format(calledDate, 'yyyy-MM')).toBe(format(subMonths(baseDate, 1), 'yyyy-MM'))
  })

  it('navigates to next month', async () => {
    render(
      <Calendar
        tasks={mockTasks}
        selectedDate={baseDate}
        onDateSelect={mockOnDateSelect}
        onMonthChange={mockOnMonthChange}
      />
    )

    const user = userEvent.setup()
    const nextButton = screen.getByTestId('next-month-button')
    await user.click(nextButton)

    expect(mockOnMonthChange).toHaveBeenCalledWith(expect.any(Date))
    const calledDate = mockOnMonthChange.mock.calls[0][0]
    expect(format(calledDate, 'yyyy-MM')).toBe(format(addMonths(baseDate, 1), 'yyyy-MM'))
  })

  it('highlights selected date', () => {
    render(
      <Calendar
        tasks={mockTasks}
        selectedDate={baseDate}
        onDateSelect={mockOnDateSelect}
        onMonthChange={mockOnMonthChange}
      />
    )

    const selectedDay = screen.getByTestId('calendar-day-2024-03-15')
    const classes = selectedDay.className.split(' ')
    expect(classes).toContain('bg-blue-100')
    expect(selectedDay.querySelector('span')).toHaveClass('text-blue-600')
  })

  it('renders empty calendar when no tasks are provided', () => {
    render(
      <Calendar
        tasks={[]}
        selectedDate={baseDate}
        onDateSelect={mockOnDateSelect}
        onMonthChange={mockOnMonthChange}
      />
    )

    // Should still render the calendar structure
    expect(screen.getByText('March 2024')).toBeInTheDocument()
    // But no task indicators
    const march15Button = screen.getByTestId('calendar-day-2024-03-15')
    expect(march15Button.querySelector('[data-testid^="task-indicator-"]')).toBeNull()
  })
})
