export type Priority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  text: string
  completed: boolean
  priority: Priority
  createdAt: Date
  completedAt?: Date
  assignedTo?: string
}

export const priorityOrder: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // Incomplete tasks come before completed tasks
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    // Sort by priority
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }

    // Sort by creation date (newer first)
    return b.createdAt.getTime() - a.createdAt.getTime()
  })
}
