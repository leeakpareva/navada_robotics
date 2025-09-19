"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Settings, Loader2 } from "lucide-react"
import { Button } from "./button"
import { Progress } from "./progress"

interface VideoPlayerProps {
  videoUrl: string
  title?: string
  onProgress?: (currentTime: number, duration: number) => void
  onComplete?: () => void
  className?: string
  autoPlay?: boolean
  lazyLoad?: boolean
}

export function VideoPlayerOptimized({
  videoUrl,
  title,
  onProgress,
  onComplete,
  className,
  autoPlay = false,
  lazyLoad = true
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInView, setIsInView] = useState(!lazyLoad)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Detect video type from URL
  const getVideoType = useCallback((url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube'
    } else if (url.includes('vimeo.com')) {
      return 'vimeo'
    } else if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
      return 'direct'
    }
    return 'unknown'
  }, [])

  // Extract video ID from YouTube URL
  const getYouTubeId = useCallback((url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }, [])

  // Extract video ID from Vimeo URL
  const getVimeoId = useCallback((url: string) => {
    const regExp = /vimeo.com\/(\d+)/
    const match = url.match(regExp)
    return match ? match[1] : null
  }, [])

  const videoType = getVideoType(videoUrl)
  const videoId = videoType === 'youtube' ? getYouTubeId(videoUrl) :
                  videoType === 'vimeo' ? getVimeoId(videoUrl) : null

  // Optimized YouTube embed URL with performance parameters
  const youtubeEmbedUrl = videoId ?
    `https://www.youtube.com/embed/${videoId}?` +
    `enablejsapi=1&controls=1&modestbranding=1&rel=0&` +
    `autoplay=${autoPlay ? 1 : 0}&` +
    `playsinline=1&` +
    `origin=${typeof window !== 'undefined' ? window.location.origin : ''}` : ''

  // Optimized Vimeo embed URL
  const vimeoEmbedUrl = videoId ?
    `https://player.vimeo.com/video/${videoId}?` +
    `api=1&player_id=vimeo_player&` +
    `autoplay=${autoPlay ? 1 : 0}&` +
    `playsinline=1` : ''

  useEffect(() => {
    // Report progress to parent component with throttling
    if (onProgress && duration > 0) {
      const throttledProgress = Math.floor(currentTime)
      if (throttledProgress % 5 === 0) { // Report every 5 seconds
        onProgress(currentTime, duration)
      }
    }

    // Check if video is completed (95% watched)
    if (onComplete && duration > 0 && currentTime / duration > 0.95) {
      onComplete()
    }
  }, [currentTime, duration, onProgress, onComplete])

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [])

  // Video control handlers with error handling
  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Play failed:', error)
        setError('Failed to play video')
      })
    }
  }, [])

  const handlePause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [])

  const handleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  const handleRestart = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setCurrentTime(0)
    }
  }, [])

  const handleFullscreen = useCallback(() => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch((error) => {
          console.error('Fullscreen failed:', error)
        })
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }, [])

  // YouTube video component
  if (videoType === 'youtube' && videoId && isInView) {
    return (
      <div ref={containerRef} className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-video relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          )}
          <iframe
            src={youtubeEmbedUrl}
            title={title || "YouTube Video"}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError('Failed to load YouTube video')
              setIsLoading(false)
            }}
          />

          {/* Custom overlay for branding */}
          {title && (
            <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium">{title}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Vimeo video component
  if (videoType === 'vimeo' && videoId && isInView) {
    return (
      <div ref={containerRef} className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-video relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          )}
          <iframe
            src={vimeoEmbedUrl}
            title={title || "Vimeo Video"}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError('Failed to load Vimeo video')
              setIsLoading(false)
            }}
          />

          {/* Custom overlay for branding */}
          {title && (
            <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium">{title}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Direct video file component
  if (videoType === 'direct' && isInView) {
    return (
      <div ref={containerRef} className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-video relative group">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-red-900/20">
              <div className="text-center">
                <p className="text-red-400 mb-2">Video Error</p>
                <p className="text-gray-400 text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              )}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={videoUrl}
                preload={lazyLoad ? "none" : "metadata"}
                autoPlay={autoPlay}
                playsInline
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => {
                  setDuration(e.currentTarget.duration)
                  setIsLoading(false)
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  setIsPlaying(false)
                  onComplete?.()
                }}
                onError={(e) => {
                  console.error('Video error:', e)
                  setError('Failed to load video')
                  setIsLoading(false)
                }}
                onLoadStart={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
              />

              {/* Custom Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {title && (
                  <div className="absolute top-4 left-4">
                    <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                      {title}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 space-y-3">
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <Progress
                      value={duration > 0 ? (currentTime / duration) * 100 : 0}
                      className="h-1 bg-white/20"
                    />
                    <div className="flex justify-between text-xs text-white/80">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={isPlaying ? handlePause : handlePlay}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={handleMute}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={handleRestart}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={handleFullscreen}
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Lazy loading placeholder
  if (!isInView) {
    return (
      <div ref={containerRef} className={`aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center border border-gray-700 ${className}`}>
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 text-purple-400 mx-auto animate-spin" />
          <p className="text-gray-400 text-sm">Loading video...</p>
        </div>
      </div>
    )
  }

  // Fallback for unknown video types
  return (
    <div ref={containerRef} className={`aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center border border-gray-700 ${className}`}>
      <div className="text-center space-y-4">
        <Play className="h-16 w-16 text-purple-400 mx-auto" />
        <div>
          <p className="text-gray-400 text-lg">Video Player</p>
          <p className="text-gray-500 text-sm">
            {title && `Ready to play: ${title}`}
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Supports YouTube, Vimeo, and direct video files
          </p>
          {error && (
            <p className="text-red-400 text-xs mt-2">
              Error: {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}