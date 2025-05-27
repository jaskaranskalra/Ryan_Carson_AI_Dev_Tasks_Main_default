export function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (error) {
    return 'UTC'
  }
}

export function formatDateForTimeZone(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(date)
  } catch (error) {
    return date.toUTCString()
  }
}

export function getTimeZoneDifference(timeZone1: string, timeZone2: string): number {
  try {
    const now = new Date()
    const tz1 = new Date(now.toLocaleString('en-US', { timeZone: timeZone1 }))
    const tz2 = new Date(now.toLocaleString('en-US', { timeZone: timeZone2 }))
    return (tz1.getTime() - tz2.getTime()) / (1000 * 60 * 60) // Convert to hours
  } catch (error) {
    return 0
  }
}

export function getTimeZoneAbbreviation(timeZone: string): string {
  try {
    const options = { timeZoneName: 'short' } as const
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(new Date())
    const timeZonePart = parts.find(part => part.type === 'timeZoneName')
    return timeZonePart?.value || timeZone
  } catch (error) {
    return timeZone
  }
}

export function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone })
    return true
  } catch (error) {
    return false
  }
}

export function getLocalTime(timeZone: string): string {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone,
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch (error) {
    return new Date().toLocaleTimeString()
  }
}
