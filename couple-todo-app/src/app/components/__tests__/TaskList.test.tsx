import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskList } from '../TaskList'
import { Task } from '@/lib/models/Task'

describe('TaskList', () => {
  const mockOnTaskComplete = jest.fn()
  const mockOnTaskDelete = jest.fn()

  const mockTasks: Task[] = [
    {
      id: '1',
      text: 'High priority task',
      completed: false,
      priority: 'high',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      text: 'Medium priority task',
      completed: true,
      priority: 'medium',
      createdAt: new Date('2024-01-02'),
      completedAt: new Date('2024-01-03'),
    },
    {
      id: '3',
      text: 'Low priority task',
      completed: false,
      priority: 'low',
      createdAt: new Date('2024-01-03'),
    },
  ]

  beforeEach(() => {
    mockOnTaskComplete.mockClear()
    mockOnTaskDelete.mockClear()
  })

  it('renders empty message when no tasks are provided', () => {
    render(
      <TaskList tasks={[]} onTaskComplete={mockOnTaskComplete} onTaskDelete={mockOnTaskDelete} />
    )

    expect(screen.getByTestId('empty-message')).toBeInTheDocument()
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })

  it('renders tasks in correct order (incomplete before complete, then by priority)', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTaskComplete={mockOnTaskComplete}
        onTaskDelete={mockOnTaskDelete}
      />
    )

    const taskItems = screen.getAllByTestId(/^task-item-/)
    expect(taskItems).toHaveLength(3)

    // First task should be high priority and incomplete
    expect(taskItems[0]).toHaveTextContent('High priority task')
    expect(screen.getByTestId('priority-1')).toHaveTextContent('high')

    // Second task should be low priority and incomplete
    expect(taskItems[1]).toHaveTextContent('Low priority task')
    expect(screen.getByTestId('priority-3')).toHaveTextContent('low')

    // Last task should be completed
    expect(taskItems[2]).toHaveTextContent('Medium priority task')
    expect(taskItems[2]).toHaveClass('opacity-75')
  })

  it('calls onTaskComplete when clicking complete button', async () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTaskComplete={mockOnTaskComplete}
        onTaskDelete={mockOnTaskDelete}
      />
    )

    const user = userEvent.setup()
    const completeButton = screen.getByTestId('complete-button-1')
    await user.click(completeButton)

    expect(mockOnTaskComplete).toHaveBeenCalledWith('1')
  })

  it('calls onTaskDelete when clicking delete button', async () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTaskComplete={mockOnTaskComplete}
        onTaskDelete={mockOnTaskDelete}
      />
    )

    const user = userEvent.setup()
    const deleteButton = screen.getByTestId('delete-button-1')
    await user.click(deleteButton)

    expect(mockOnTaskDelete).toHaveBeenCalledWith('1')
  })

  it('displays correct task status and styling', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTaskComplete={mockOnTaskComplete}
        onTaskDelete={mockOnTaskDelete}
      />
    )

    // Check completed task
    const completedTask = screen.getByText('Medium priority task')
    expect(completedTask).toHaveClass('line-through')

    // Check incomplete task
    const incompleteTask = screen.getByText('High priority task')
    expect(incompleteTask).not.toHaveClass('line-through')
  })

  it('displays correct priority colors', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTaskComplete={mockOnTaskComplete}
        onTaskDelete={mockOnTaskDelete}
      />
    )

    const highPriority = screen.getByTestId('priority-1')
    expect(highPriority).toHaveClass('bg-red-100')

    const mediumPriority = screen.getByTestId('priority-2')
    expect(mediumPriority).toHaveClass('bg-yellow-100')

    const lowPriority = screen.getByTestId('priority-3')
    expect(lowPriority).toHaveClass('bg-green-100')
  })
})
