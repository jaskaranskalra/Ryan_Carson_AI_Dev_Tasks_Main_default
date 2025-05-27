'use client'

import { useState, useEffect } from 'react'
import { OptimizedImage } from './OptimizedImage'

interface Partner {
  id: string
  name: string
  email: string
  avatar: string | null
}

interface PartnerData {
  partnerCode: string | null
  partner: Partner | null
}

export function PartnerConnect() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null)
  const [partnerCode, setPartnerCode] = useState('')

  useEffect(() => {
    fetchPartnerData()
  }, [])

  const fetchPartnerData = async () => {
    try {
      const response = await fetch('/api/partner')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch partner data')
      }

      setPartnerData(data)
    } catch (error) {
      setError('Failed to load partner data')
    } finally {
      setIsLoading(false)
    }
  }

  const generatePartnerCode = async () => {
    try {
      setError('')
      setSuccess('')
      
      const response = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate partner code')
      }

      await fetchPartnerData()
      setSuccess('Partner code generated successfully')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate partner code')
    }
  }

  const connectWithPartner = async () => {
    try {
      setError('')
      setSuccess('')
      
      const response = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', partnerCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to connect with partner')
      }

      await fetchPartnerData()
      setPartnerCode('')
      setSuccess('Successfully connected with partner')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to connect with partner')
    }
  }

  const disconnectFromPartner = async () => {
    try {
      setError('')
      setSuccess('')
      
      const response = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to disconnect from partner')
      }

      await fetchPartnerData()
      setSuccess('Successfully disconnected from partner')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to disconnect from partner')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Partner Connection</h2>

        {partnerData?.partner ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden">
                {partnerData.partner.avatar ? (
                  <OptimizedImage
                    src={partnerData.partner.avatar}
                    alt={partnerData.partner.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">No image</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {partnerData.partner.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {partnerData.partner.email}
                </p>
              </div>
            </div>
            <button
              onClick={disconnectFromPartner}
              className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Disconnect from Partner
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {partnerData?.partnerCode ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share this code with your partner:
                </p>
                <div className="flex items-center space-x-2">
                  <code className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md font-mono text-sm">
                    {partnerData.partnerCode}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(partnerData.partnerCode!)
                      setSuccess('Code copied to clipboard')
                    }}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={generatePartnerCode}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Generate Partner Code
              </button>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                  Or connect with code
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value)}
                placeholder="Enter partner code"
                className="block w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={connectWithPartner}
                disabled={!partnerCode}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Connect with Partner
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-500 dark:text-red-400" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-sm text-green-500 dark:text-green-400" role="alert">
            {success}
          </div>
        )}
      </div>
    </div>
  )
} 