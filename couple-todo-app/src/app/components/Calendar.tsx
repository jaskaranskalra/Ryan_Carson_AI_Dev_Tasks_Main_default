import React from 'react'
import { Task } from '@/lib/models/Task'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface CalendarProps {
  tasks: Task[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onMonthChange: (date: Date) => void
}

export const Calendar: React.FC<CalendarProps> = ({
  tasks,
  selectedDate,
  onDateSelect,
  onMonthChange,
}) => {
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt)
      return isSameDay(taskDate, date)
    })
  }

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() - 1)
    onMonthChange(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + 1)
    onMonthChange(newDate)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            aria-label="previous month"
            data-testid="prev-month-button"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            aria-label="next month"
            data-testid="next-month-button"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}

        {daysInMonth.map((date) => {
          const dayTasks = getTasksForDate(date)
          const isSelected = isSameDay(date, selectedDate)
          const hasHighPriority = dayTasks.some((task) => task.priority === 'high')
          const dateString = format(date, 'yyyy-MM-dd')

          return (
            <button
              key={dateString}
              onClick={() => onDateSelect(date)}
              className={`p-2 text-sm rounded-lg relative ${
                isSelected
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`.trim()}
              data-testid={`calendar-day-${dateString}`}
            >
              <span
                className={
                  isSelected
                    ? 'text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300'
                }
              >
                {format(date, 'd')}
              </span>

              {dayTasks.length > 0 && (
                <div
                  className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                    hasHighPriority ? 'bg-red-500' : 'bg-blue-500'
                  }`.trim()}
                  data-testid={`task-indicator-${dateString}`}
                  aria-label={`${dayTasks.length} tasks on ${format(date, 'MMM d')}`}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
