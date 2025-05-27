'use client'

import { useState } from 'react'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  quality?: number
  objectFit?: 'contain' | 'cover' | 'fill'
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div
        className={twMerge(
          'flex items-center justify-center bg-gray-100 dark:bg-gray-800',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm text-gray-500 dark:text-gray-400">Failed to load image</span>
      </div>
    )
  }

  return (
    <div className={twMerge('relative', className)} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={twMerge(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'fill' && 'object-fill'
        )}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-blue-500" />
        </div>
      )}
    </div>
  )
} 