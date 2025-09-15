"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Settings } from "lucide-react"
import { Button } from "./button"
import { Progress } from "./progress"

interface VideoPlayerProps {
  videoUrl: string
  title?: string
  onProgress?: (currentTime: number, duration: number) => void
  onComplete?: () => void
  className?: string
}

export function VideoPlayer({ videoUrl, title, onProgress, onComplete, className }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Detect video type from URL
  const getVideoType = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube'
    } else if (url.includes('vimeo.com')) {
      return 'vimeo'
    } else if (url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg')) {
      return 'direct'
    }
    return 'unknown'
  }

  // Extract video ID from YouTube URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Extract video ID from Vimeo URL
  const getVimeoId = (url: string) => {
    const regExp = /vimeo.com\/(\d+)/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  const videoType = getVideoType(videoUrl)
  const videoId = videoType === 'youtube' ? getYouTubeId(videoUrl) :
                  videoType === 'vimeo' ? getVimeoId(videoUrl) : null

  // YouTube embed URL
  const youtubeEmbedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0` : ''

  // Vimeo embed URL
  const vimeoEmbedUrl = videoId ? `https://player.vimeo.com/video/${videoId}?api=1&player_id=vimeo_player` : ''

  useEffect(() => {
    // Report progress to parent component
    if (onProgress && duration > 0) {
      onProgress(currentTime, duration)
    }

    // Check if video is completed (95% watched)
    if (onComplete && duration > 0 && currentTime / duration > 0.95) {
      onComplete()
    }
  }, [currentTime, duration, onProgress, onComplete])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (videoType === 'youtube' && videoId) {
    return (
      <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-video relative">
          <iframe
            src={youtubeEmbedUrl}
            title={title || "Video"}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Custom overlay for branding */}
          <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full">
            <span className="text-white text-sm font-medium">{title}</span>
          </div>
        </div>
      </div>
    )
  }

  if (videoType === 'vimeo' && videoId) {
    return (
      <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-video relative">
          <iframe
            src={vimeoEmbedUrl}
            title={title || "Video"}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />

          {/* Custom overlay for branding */}
          <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full">
            <span className="text-white text-sm font-medium">{title}</span>
          </div>
        </div>
      </div>
    )
  }

  if (videoType === 'direct') {
    return (
      <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-video relative group">
          <video
            className="w-full h-full object-cover"
            src={videoUrl}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false)
              onComplete?.()
            }}
          />

          {/* Custom Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-4 left-4">
              <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                {title}
              </span>
            </div>

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
                    onClick={() => {
                      const video = document.querySelector('video')
                      if (video) {
                        if (isPlaying) {
                          video.pause()
                        } else {
                          video.play()
                        }
                      }
                    }}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => {
                      const video = document.querySelector('video')
                      if (video) {
                        video.muted = !isMuted
                        setIsMuted(!isMuted)
                      }
                    }}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => {
                      const video = document.querySelector('video')
                      if (video) {
                        video.currentTime = 0
                        setCurrentTime(0)
                      }
                    }}
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
                    onClick={() => {
                      const video = document.querySelector('video')
                      if (video) {
                        if (!document.fullscreenElement) {
                          video.requestFullscreen()
                          setIsFullscreen(true)
                        } else {
                          document.exitFullscreen()
                          setIsFullscreen(false)
                        }
                      }
                    }}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback for unknown video types
  return (
    <div className={`aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center border border-gray-700 ${className}`}>
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
        </div>
      </div>
    </div>
  )
}