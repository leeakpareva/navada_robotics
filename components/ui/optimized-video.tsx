"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedVideoProps {
  src: string
  className?: string
  poster?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  preload?: "none" | "metadata" | "auto"
}

export function OptimizedVideo({
  src,
  className,
  poster,
  autoPlay = false,
  loop = true,
  muted = true,
  playsInline = true,
  preload = "metadata", // Optimized preload setting
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Start loading earlier
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    if (isInView && autoPlay) {
      video.play().catch((error) => {
        console.log("Autoplay prevented:", error)
        setHasError(true)
      })
    } else if (!isInView && !video.paused) {
      video.pause()
    }
  }, [isInView, autoPlay])

  // Preload video metadata when in view
  useEffect(() => {
    if (isInView && videoRef.current && !videoRef.current.src) {
      videoRef.current.src = src
    }
  }, [isInView, src])

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-pulse" />
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="w-8 h-8 mx-auto mb-2 opacity-50">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
            </div>
            <p className="text-xs">Video unavailable</p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        poster={poster}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
        onLoadedData={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        className={cn(
          "w-full h-full object-cover transition-all duration-700",
          isLoading ? "opacity-0 scale-110" : "opacity-100 scale-100",
          hasError && "hidden"
        )}
        style={{
          filter: isLoading ? 'blur(4px)' : 'blur(0px)'
        }}
      />
    </div>
  )
}