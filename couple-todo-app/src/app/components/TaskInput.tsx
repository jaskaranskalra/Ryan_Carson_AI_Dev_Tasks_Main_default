import React, { useState, KeyboardEvent } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'

interface TaskInputProps {
  onTaskAdd: (taskText: string) => void
  placeholder?: string
}

export const TaskInput: React.FC<TaskInputProps> = ({
  onTaskAdd,
  placeholder = 'Add a new task...',
}) => {
  const [taskText, setTaskText] = useState('')

  const handleSubmit = () => {
    const trimmedText = taskText.trim()
    if (trimmedText) {
      onTaskAdd(trimmedText)
      setTaskText('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <button
        onClick={handleSubmit}
        disabled={!taskText.trim()}
        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        aria-label="add task"
      >
        <PlusIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </button>
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
        data-testid="task-input"
      />
    </div>
  )
}
