"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Loader2 } from "lucide-react"
import { Button } from "./button"

interface YouTubeEmbedProps {
  videoUrl: string
  title?: string
  autoPlay?: boolean
  lazyLoad?: boolean
  className?: string
}

export function YouTubeEmbed({
  videoUrl,
  title,
  autoPlay = false,
  lazyLoad = true,
  className = ""
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(!lazyLoad)
  const [shouldLoad, setShouldLoad] = useState(!lazyLoad)
  const [error, setError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  // Extract video ID from YouTube URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = getYouTubeId(videoUrl)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazyLoad || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [lazyLoad])

  // Generate optimized YouTube embed URL
  const getEmbedUrl = () => {
    if (!videoId) return ''

    const params = new URLSearchParams({
      enablejsapi: '1',
      controls: '1',
      modestbranding: '1',
      rel: '0',
      autoplay: autoPlay ? '1' : '0',
      playsinline: '1',
      iv_load_policy: '3', // Hide annotations
      fs: '1', // Allow fullscreen
      cc_load_policy: '0', // Hide captions by default
      disablekb: '0', // Enable keyboard controls
      ...(typeof window !== 'undefined' && { origin: window.location.origin })
    })

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }

  // YouTube thumbnail URL for preview
  const getThumbnailUrl = () => {
    if (!videoId) return ''
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  const handleLoadVideo = () => {
    setShouldLoad(true)
    setIsLoaded(false)
  }

  const handleIframeLoad = () => {
    setIsLoaded(true)
  }

  const handleIframeError = () => {
    setError('Failed to load YouTube video')
    setIsLoaded(true)
  }

  if (!videoId) {
    return (
      <div className={`aspect-video bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-lg flex items-center justify-center border border-red-700/50 ${className}`}>
        <div className="text-center">
          <p className="text-red-400 text-lg">Invalid YouTube URL</p>
          <p className="text-gray-500 text-sm mt-1">Please check the video link</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`aspect-video bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-lg flex items-center justify-center border border-red-700/50 ${className}`}>
        <div className="text-center">
          <p className="text-red-400 text-lg">Video Error</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 border-red-400/50 text-red-400 hover:bg-red-400/10"
            onClick={() => {
              setError(null)
              setShouldLoad(true)
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Show thumbnail preview with play button (click to load)
  if (lazyLoad && isInView && !shouldLoad) {
    return (
      <div ref={containerRef} className={`relative aspect-video bg-black rounded-lg overflow-hidden group cursor-pointer ${className}`}>
        <img
          src={getThumbnailUrl()}
          alt={title || "YouTube Video Thumbnail"}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback to lower quality thumbnail
            e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          }}
        />

        {/* Play button overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-300"
          onClick={handleLoadVideo}
        >
          <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
            <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Title overlay */}
        {title && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
              <p className="text-white text-sm font-medium line-clamp-2">{title}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Show loading state or iframe
  return (
    <div ref={containerRef} className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Loading YouTube video...</p>
          </div>
        </div>
      )}

      {(shouldLoad || !lazyLoad) && (
        <iframe
          src={getEmbedUrl()}
          title={title || "YouTube Video"}
          className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}

      {/* Title overlay for iframe */}
      {title && isLoaded && (
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-sm font-medium">{title}</span>
        </div>
      )}
    </div>
  )
}