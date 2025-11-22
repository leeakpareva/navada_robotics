"use client"

import { useState } from "react"

interface ProjectVideoProps {
  src: string
  title: string
  poster?: string
  className?: string
}

export function ProjectVideo({ src, title, poster, className = "" }: ProjectVideoProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    console.error(`Error loading video: ${src}`)
    setHasError(true)
    setIsLoading(false)
  }

  const handleCanPlay = () => {
    setIsLoading(false)
  }

  const handleLoadStart = () => {
    setIsLoading(true)
  }

  if (hasError) {
    return (
      <div className={`bg-gray-900 rounded-2xl flex items-center justify-center min-h-[300px] ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-400 mb-2">Video Preview Unavailable</p>
          <p className="text-gray-500 text-sm">{title}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-black rounded-2xl flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-sm">Loading {title}...</p>
          </div>
        </div>
      )}

      <video
        src={src}
        controls
        preload="metadata"
        className="w-full h-auto rounded-2xl"
        poster={poster || "/logo.PNG"}
        playsInline
        muted
        onError={handleError}
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
        aria-label={title}
        style={{ maxWidth: "100%" }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}