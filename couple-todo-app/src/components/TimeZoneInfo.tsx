'use client'

import { useState, useEffect } from 'react'
import {
  detectTimeZone,
  formatDateForTimeZone,
  getTimeZoneDifference,
  getTimeZoneAbbreviation,
  getLocalTime,
} from '@/lib/utils/timeZone'

interface TimeZoneInfoProps {
  userTimeZone: string
  partnerTimeZone?: string
}

export function TimeZoneInfo({ userTimeZone, partnerTimeZone }: TimeZoneInfoProps) {
  const [currentTime, setCurrentTime] = useState<string>(getLocalTime(userTimeZone))
  const [partnerTime, setPartnerTime] = useState<string>('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getLocalTime(userTimeZone))
      if (partnerTimeZone) {
        setPartnerTime(getLocalTime(partnerTimeZone))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [userTimeZone, partnerTimeZone])

  const userAbbr = getTimeZoneAbbreviation(userTimeZone)
  const partnerAbbr = partnerTimeZone ? getTimeZoneAbbreviation(partnerTimeZone) : null
  const timeDiff = partnerTimeZone ? getTimeZoneDifference(partnerTimeZone, userTimeZone) : 0

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Time Zone Information</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Time</h3>
          <div className="mt-1 flex items-baseline">
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {currentTime}
            </div>
            <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {userAbbr}
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {userTimeZone}
          </div>
        </div>

        {partnerTimeZone && (
          <>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Partner's Time</h3>
              <div className="mt-1 flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {partnerTime}
                </div>
                <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {partnerAbbr}
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {partnerTimeZone}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Difference</h3>
              <div className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                {Math.abs(timeDiff)} hours {timeDiff >= 0 ? 'ahead' : 'behind'}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 