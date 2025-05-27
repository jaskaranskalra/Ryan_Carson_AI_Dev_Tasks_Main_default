import React from 'react'
import { Task, Priority, sortTasks } from '@/lib/models/Task'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface TaskListProps {
  tasks: Task[]
  onTaskComplete: (taskId: string) => void
  onTaskDelete: (taskId: string) => void
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskComplete, onTaskDelete }) => {
  const sortedTasks = sortTasks(tasks)

  if (tasks.length === 0) {
    return (
      <div
        className="text-center text-gray-500 dark:text-gray-400 py-8"
        data-testid="empty-message"
      >
        No tasks yet. Add one above!
      </div>
    )
  }

  return (
    <ul className="space-y-4" data-testid="task-list">
      {sortedTasks.map((task) => (
        <li
          key={task.id}
          className={`flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
            task.completed
              ? 'border-gray-200 dark:border-gray-700 opacity-75'
              : 'border-gray-200 dark:border-gray-700'
          }`}
          data-testid={`task-item-${task.id}`}
        >
          <button
            onClick={() => onTaskComplete(task.id)}
            className={`flex-shrink-0 ${
              task.completed
                ? 'text-green-500 dark:text-green-400'
                : 'text-gray-400 dark:text-gray-500 hover:text-green-500 dark:hover:text-green-400'
            }`}
            aria-label={task.completed ? 'mark as incomplete' : 'mark as complete'}
            data-testid={`complete-button-${task.id}`}
          >
            <CheckCircleIcon className="h-6 w-6" />
          </button>

          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium ${
                task.completed
                  ? 'text-gray-500 dark:text-gray-400 line-through'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {task.text}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  priorityColors[task.priority]
                }`}
                data-testid={`priority-${task.id}`}
              >
                {task.priority}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {format(task.createdAt, 'MMM d, yyyy')}
              </span>
            </div>
          </div>

          <button
            onClick={() => onTaskDelete(task.id)}
            className="flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
            aria-label="delete task"
            data-testid={`delete-button-${task.id}`}
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </li>
      ))}
    </ul>
  )
}
