"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Slider } from "./slider"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Loader2,
  Settings,
  Download
} from "lucide-react"
import { toast } from "sonner"

interface TextToSpeechProps {
  text: string
  title?: string
  className?: string
}

export function TextToSpeech({ text, title, className }: TextToSpeechProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [voice, setVoice] = useState("alloy")
  const [speed, setSpeed] = useState(1.0)
  const [volume, setVolume] = useState(1.0)
  const [showSettings, setShowSettings] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Voice options
  const voices = [
    { value: "alloy", name: "Alloy (Neutral)" },
    { value: "echo", name: "Echo (Male)" },
    { value: "fable", name: "Fable (British Male)" },
    { value: "onyx", name: "Onyx (Deep Male)" },
    { value: "nova", name: "Nova (Female)" },
    { value: "shimmer", name: "Shimmer (Soft Female)" }
  ]

  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  // Update audio element when audioUrl changes
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl
      audioRef.current.volume = volume
    }
  }, [audioUrl, volume])

  const generateSpeech = async () => {
    if (!text || text.trim().length === 0) {
      toast.error("No text to convert to speech")
      return
    }

    if (text.length > 4000) {
      toast.error("Text is too long. Maximum 4000 characters allowed.")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/learning/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          voice,
          speed
        })
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const url = URL.createObjectURL(audioBlob)

        // Clean up previous audio URL
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }

        setAudioUrl(url)
        toast.success("Speech generated successfully!")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to generate speech")
      }
    } catch (error) {
      console.error("Error generating speech:", error)
      toast.error("Failed to generate speech")
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  const stopPlayback = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setCurrentTime(0)
  }

  const downloadAudio = () => {
    if (!audioUrl) return

    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `${title || 'lesson'}-audio.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className={`bg-gray-800/50 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-purple-400" />
            Text to Speech
            {title && <span className="text-gray-400 text-sm">- {title}</span>}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-400 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Settings Panel */}
        {showSettings && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-black/20 rounded-lg border border-gray-600">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Voice</label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {voices.map((v) => (
                    <SelectItem key={v.value} value={v.value}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Speed: {speed}x</label>
              <Slider
                value={[speed]}
                onValueChange={(value) => setSpeed(value[0])}
                min={0.25}
                max={4.0}
                step={0.25}
                className="py-2"
              />
            </div>
          </div>
        )}

        {/* Text Preview */}
        <div className="p-3 bg-black/20 rounded-lg border border-gray-600">
          <p className="text-gray-300 text-sm">
            {text.length > 200 ? `${text.substring(0, 200)}...` : text}
          </p>
          <div className="text-xs text-gray-500 mt-2">
            {text.length} characters
          </div>
        </div>

        {/* Audio Controls */}
        {audioUrl && (
          <div className="space-y-3">
            <audio
              ref={audioRef}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={togglePlayback}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={stopPlayback}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  <Square className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={downloadAudio}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <VolumeX className="h-4 w-4 text-gray-400" />
                  <Slider
                    value={[volume]}
                    onValueChange={(value) => setVolume(value[0])}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-20"
                  />
                  <Volume2 className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={generateSpeech}
          disabled={isGenerating || !text.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Speech...
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 mr-2" />
              {audioUrl ? "Regenerate Speech" : "Generate Speech"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}