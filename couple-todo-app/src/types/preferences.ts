export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    push: boolean
    taskReminders: boolean
    partnerUpdates: boolean
  }
  privacy: {
    showEmail: boolean
    showLastActive: boolean
    showTaskDetails: boolean
  }
  display: {
    defaultView: 'list' | 'calendar' | 'board'
    taskSortOrder: 'priority' | 'dueDate' | 'createdAt'
    showCompletedTasks: boolean
    tasksPerPage: number
  }
  dateTime: {
    format24Hour: boolean
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Sunday, 1 = Monday, etc.
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  }
}

export const defaultPreferences: UserPreferences = {
  theme: 'system',
  notifications: {
    email: true,
    push: true,
    taskReminders: true,
    partnerUpdates: true,
  },
  privacy: {
    showEmail: true,
    showLastActive: true,
    showTaskDetails: true,
  },
  display: {
    defaultView: 'list',
    taskSortOrder: 'dueDate',
    showCompletedTasks: true,
    tasksPerPage: 20,
  },
  dateTime: {
    format24Hour: false,
    weekStartsOn: 0,
    dateFormat: 'MM/DD/YYYY',
  },
} 