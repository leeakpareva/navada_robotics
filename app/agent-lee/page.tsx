"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BeamsBackground } from "@/components/ui/beams-background"
import {
  Menu,
  X,
  Cog,
  CircuitBoard,
  Hammer,
  ShieldCheck,
  PhoneCall,
  SendHorizonal,
  UserCircle2,
  Mic2,
  MicOff,
  AudioLines,
  VolumeX,
  BrainCircuit,
  Sparkles,
  Zap,
  MessagesSquare,
  Code2,
  Globe2,
  ImagePlus,
  RocketIcon,
  BotMessageSquare,
  Cpu,
  Atom,
  Binary,
  Boxes,
  Dna,
  Fingerprint,
  GitBranch,
  Infinity,
  Network,
  Orbit,
  QrCode,
  Radio,
  Satellite,
  ScanFace,
  Terminal,
  Wand2,
  Workflow,
  Activity,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Download,
  FileDown,
  Settings2,
  Home,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"


interface Message {
  id: number
  text: string
  sender: "user" | "agent"
  timestamp: Date
  image?: string // Base64 data URL for images
  website?: any // Website generation data
}

export default function AgentLeePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState("")
  const [apiProvider, setApiProvider] = useState<'openai' | 'deepseek'>('openai')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "🚀 Hello! I'm Agent Lee, your AI powerhouse for robotics, deep learning, and computer vision!\n\n✨ I can help you with:\n• 🤖 Robotics guidance and project tutorials\n• 🐍 Python programming instruction\n• 👁️ Computer vision and OpenCV help\n• 🖼️ DALL-E 3 image generation (just say \"generate image\")\n• 🌐 NextJS website creation (just say \"create website\")\n\nWhat amazing things shall we build today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef<boolean>(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition && window.speechSynthesis) {
        setSpeechSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInputMessage(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = async (text: string) => {
    if (!speechSupported || isMuted || isPlayingRef.current) {
      console.log("[v0] Speech not supported, muted, or already playing")
      return
    }

    // Stop any currently playing audio/speech before starting new one
    stopSpeaking()

    // Set flag to prevent duplicate calls
    isPlayingRef.current = true

    try {
      console.log("[v0] Starting speakText function")

      await new Promise((resolve) => setTimeout(resolve, 100))

      setIsSpeaking(true)

      console.log("[v0] Calling TTS API...")
      const response = await fetch("/api/agent-lee/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      console.log("[v0] TTS API response status:", response.status)

      if (response.ok) {
        const contentType = response.headers.get("content-type")
        console.log("[v0] TTS response content type:", contentType)

        if (contentType?.includes("audio/mpeg")) {
          console.log("[v0] Playing OpenAI TTS audio")
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)

          // Store reference to current audio for stopping
          currentAudioRef.current = audio

          audio.onended = () => {
            console.log("[v0] OpenAI TTS audio ended")
            setIsSpeaking(false)
            URL.revokeObjectURL(audioUrl)
            currentAudioRef.current = null
            isPlayingRef.current = false
          }

          audio.onerror = (error) => {
            console.log("[v0] OpenAI TTS audio error, falling back to browser TTS:", error)
            setIsSpeaking(false)
            URL.revokeObjectURL(audioUrl)
            currentAudioRef.current = null
            isPlayingRef.current = false
            fallbackToBrowserTTS(text)
          }

          await audio.play()
        } else {
          console.log("[v0] Using browser TTS (non-audio response)")
          fallbackToBrowserTTS(text)
        }
      } else {
        console.log("[v0] TTS API failed, using browser TTS fallback")
        isPlayingRef.current = false
        fallbackToBrowserTTS(text)
      }
    } catch (error) {
      console.error("[v0] TTS error, using browser TTS fallback:", error)
      isPlayingRef.current = false
      fallbackToBrowserTTS(text)
    }
  }

  const fallbackToBrowserTTS = (text: string) => {
    try {
      // Stop any current audio first
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => {
        console.log("[v0] Browser TTS started")
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        console.log("[v0] Browser TTS ended")
        setIsSpeaking(false)
        isPlayingRef.current = false
      }

      utterance.onerror = (event) => {
        console.log("[v0] Browser TTS error:", event.error)
        setIsSpeaking(false)
        isPlayingRef.current = false
      }

      setTimeout(() => {
        if (isSpeaking) {
          console.log("[v0] TTS timeout - resetting isSpeaking state")
          setIsSpeaking(false)
        }
      }, 30000) // 30 second timeout

      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("[v0] Browser TTS fallback failed:", error)
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    console.log("[v0] Stopping all speech and audio")

    // Stop current audio if it exists
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }

    // Stop any other audio elements as backup
    const audioElements = document.querySelectorAll("audio")
    audioElements.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })

    // Cancel browser speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    setIsSpeaking(false)
    isPlayingRef.current = false
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted && isSpeaking) {
      stopSpeaking()
    }
  }

  const handleLogin = () => {
    if (username === "Agent Lee" && password === "Activate") {
      setIsAuthenticated(true)
      setAuthError("")
    } else {
      setAuthError("Invalid credentials. Please try again.")
    }
  }

  const handleKeyPressLogin = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  const downloadContent = (content: string, filename: string, type: string = 'text/plain') => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadImage = (imageSrc: string, filename: string) => {
    const a = document.createElement('a')
    a.href = imageSrc
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage("")
    setIsTyping(true)

    try {
      console.log("[v0] Sending message to Agent Lee:", currentMessage)

      const response = await fetch("/api/agent-lee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          threadId: threadId,
          lastImage: lastGeneratedImage,
          apiProvider: apiProvider,
        }),
      })

      console.log("[v0] API response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] API error response:", errorText)
        throw new Error(`Failed to get response from Agent Lee: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] Agent Lee response:", data)
      console.log("[v0] Response has image:", !!data.image)
      if (data.image) {
        console.log("[v0] Image data length:", data.image.length)
        console.log("[v0] Image data preview:", data.image.substring(0, 50) + "...")
      }

      if (data.threadId && !threadId) {
        setThreadId(data.threadId)
      }

      const agentResponse: Message = {
        id: messages.length + 2,
        text: data.message,
        sender: "agent",
        timestamp: new Date(),
        image: data.image, // Include image data if present
        website: data.website, // Include website data if present
      }

      // Update the last generated image if a new one was created
      if (data.image) {
        console.log("[v0] Updating last generated image for future analysis")
        setLastGeneratedImage(data.image)
      }

      setMessages((prev) => [...prev, agentResponse])

      console.log("[v0] Attempting to speak Agent Lee response")
      console.log("[v0] Speech supported:", speechSupported)
      console.log("[v0] Currently speaking:", isSpeaking)
      console.log("[v0] Is muted:", isMuted)

      if (speechSupported && !isMuted) {
        console.log("[v0] Calling speakText with message:", data.message)
        setTimeout(() => {
          speakText(data.message)
        }, 500) // Small delay to ensure UI updates first
      } else {
        console.log("[v0] Speech not supported or muted - skipping voice output")
      }
    } catch (error) {
      console.error("[v0] Error calling Agent Lee API:", error)
      const errorResponse: Message = {
        id: messages.length + 2,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { icon: <Orbit className="h-3 w-3" />, text: "How do I start with robotics?", color: "from-purple-500 to-pink-500" },
    { icon: <ScanFace className="h-3 w-3" />, text: "Explain computer vision basics", color: "from-cyan-500 to-blue-500" },
    { icon: <Binary className="h-3 w-3" />, text: "Python for deep learning", color: "from-green-500 to-emerald-500" },
    { icon: <CircuitBoard className="h-3 w-3" />, text: "Raspberry Pi robot projects", color: "from-purple-500 to-violet-500" },
    { icon: <Wand2 className="h-3 w-3" />, text: "Generate image of a robot", color: "from-pink-500 to-rose-500" },
    { icon: <Network className="h-3 w-3" />, text: "Create a portfolio website", color: "from-blue-500 to-indigo-500" },
  ]

  // Login page UI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <BeamsBackground intensity="subtle" className="absolute inset-0" />
        <div className="relative z-10 w-full max-w-md mx-auto px-6">
          <Card className="bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-sm border-white/20 shadow-2xl shadow-purple-500/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-to-r from-purple-600/40 to-pink-600/40 blur-2xl w-20 h-20 rounded-full animate-pulse"></div>
                  </div>
                  <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 p-4 rounded-xl shadow-xl shadow-purple-500/50">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Agent Lee Access
                </h2>
                <p className="text-white text-sm">Enter your credentials to continue</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Username</label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPressLogin}
                    placeholder="Enter username"
                    className="bg-black/30 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPressLogin}
                      placeholder="Enter password"
                      className="bg-black/30 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 transition-all duration-300 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {authError && (
                  <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-400/50 rounded-lg p-2">
                    {authError}
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Access Agent Lee
                  </Button>

                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full border-purple-400/50 text-purple-300 hover:bg-purple-600/20 hover:border-purple-400 hover:text-white transition-all duration-300"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white">NAVADA</h1>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-colors">
                Solutions
              </Link>
              <Link href="/services" className="text-white hover:text-purple-400 transition-colors">
                Services
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                About
              </Link>
              <Link href="/ai-analytics" className="text-white hover:text-purple-400 transition-colors">
                AI Analytics
              </Link>
              <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                Learning
              </Link>
              <Link href="/agent-lee" className="text-purple-400 font-medium">
                Agent Lee
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Mobile navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
              <div className="flex flex-col space-y-3">
                <Link href="/solutions" className="text-white hover:text-purple-400 transition-colors">
                  Solutions
                </Link>
                <Link href="/services" className="text-white hover:text-purple-400 transition-colors">
                  Services
                </Link>
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                  About
                </Link>
                <Link href="/ai-analytics" className="text-white hover:text-purple-400 transition-colors">
                  AI Analytics
                </Link>
                <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                  Learning
                </Link>
                <Link href="/agent-lee" className="text-purple-400 font-medium">
                  Agent Lee
                </Link>
                <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Chat Interface */}
      <BeamsBackground
        intensity="subtle"
        className="flex-1 flex flex-col"
      >
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-6">
          {/* Agent Lee Header - More Vibrant */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gradient-to-r from-purple-600/40 to-pink-600/40 blur-3xl w-32 h-32 rounded-full animate-pulse"></div>
              </div>
              <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 p-5 rounded-2xl shadow-2xl shadow-purple-500/50 transform hover:scale-110 transition-all duration-300">
                <BrainCircuit className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 animate-pulse">
              Agent Lee
            </h2>
            <p className="text-gray-300 text-lg mb-2">Your AI Powerhouse for Innovation</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-600/20 border border-purple-400/50 text-purple-300 text-sm font-medium min-w-[120px] justify-center">
                AI Assistant
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-600/20 border border-purple-400/50 text-purple-300 text-sm font-medium min-w-[120px] justify-center">
                Image Generation
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-600/20 border border-purple-400/50 text-purple-300 text-sm font-medium min-w-[120px] justify-center">
                Website Builder
              </span>
              {speechSupported && (
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-600/20 border border-purple-400/50 text-purple-300 text-sm font-medium min-w-[120px] justify-center">
                  Voice Enabled
                </span>
              )}
            </div>
            {speechSupported && (
              <div className="flex items-center justify-center mt-3">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="sm"
                  className="text-purple-400 hover:bg-purple-600/20 hover:text-purple-300 transition-all duration-300"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <AudioLines className="h-4 w-4" />}
                  <span className="ml-2">{isMuted ? 'Unmute' : 'Mute'}</span>
                </Button>
              </div>
            )}
          </div>

          {/* API Provider Settings */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">AI Provider:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={apiProvider === 'openai' ? 'default' : 'outline'}
                  onClick={() => setApiProvider('openai')}
                  className={apiProvider === 'openai' ? 'bg-green-600 hover:bg-green-700' : 'border-gray-600 text-gray-300'}
                >
                  OpenAI
                </Button>
                <Button
                  size="sm"
                  variant={apiProvider === 'deepseek' ? 'default' : 'outline'}
                  onClick={() => setApiProvider('deepseek')}
                  className={apiProvider === 'deepseek' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300'}
                >
                  DeepSeek
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions - More Vibrant */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">
              Quick actions to get started:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`relative overflow-hidden text-xs bg-black/50 border-white/20 text-white hover:border-purple-400 transition-all duration-300 hover:scale-105 group cursor-pointer active:bg-purple-600/40 active:border-purple-300 active:scale-95`}
                  onClick={() => {
                    setInputMessage(action.text)
                    // Visual feedback for selection
                    setTimeout(() => {
                      const button = document.activeElement as HTMLElement
                      button?.blur()
                    }, 150)
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  <span className="relative">
                    {action.text}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Messages - Enhanced UI */}
          <Card className="flex-1 bg-gradient-to-br from-black/40 via-purple-900/10 to-black/40 backdrop-blur-sm border-white/20 mb-4 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
            <CardContent className="p-6 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600/50 scrollbar-track-transparent">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
                    <div className={`flex items-start space-x-3 max-w-[80%]`}>
                      {message.sender === "agent" && (
                        <div className="relative">
                          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2.5 rounded-xl shadow-lg shadow-purple-500/30">
                            <BrainCircuit className="h-5 w-5 text-white" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>
                        </div>
                      )}
                      <div
                        className={`relative p-4 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                            : "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-gray-700 shadow-lg"
                        } transition-all duration-300 hover:scale-[1.02]`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                        {message.image && (
                          <div className="mt-4 rounded-xl overflow-hidden border-2 border-purple-400/50 shadow-xl">
                            <img
                              src={message.image}
                              alt="Generated image"
                              className="w-full h-auto"
                              style={{ maxWidth: '400px', maxHeight: '400px' }}
                              onLoad={() => console.log("[v0] Image loaded successfully")}
                              onError={(e) => console.error("[v0] Image failed to load:", e)}
                            />
                          </div>
                        )}
                        {message.website && (
                          <div className="mt-4 p-4 bg-black/50 rounded-xl border border-cyan-400/50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Infinity className="h-5 w-5 text-cyan-400" />
                                <span className="text-cyan-300 font-semibold">Website Generated!</span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => downloadContent(JSON.stringify(message.website, null, 2), `website-${Date.now()}.json`, 'application/json')}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                            <p className="text-sm text-gray-300">
                              Your website has been created successfully. Files are ready for download.
                            </p>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs opacity-60">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          <div className="flex gap-2">
                            {message.sender === "agent" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-3 text-xs hover:bg-white/10 text-white/70 hover:text-white transition-all duration-300"
                                onClick={() => downloadContent(message.text, `agent-lee-response-${message.id}.txt`)}
                              >
                                <FileDown className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                            )}
                            {message.image && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-3 text-xs hover:bg-white/10 text-white/70 hover:text-white transition-all duration-300"
                                onClick={() => downloadImage(message.image!, `agent-lee-image-${message.id}.png`)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Image
                              </Button>
                            )}
                            {message.sender === "agent" && speechSupported && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-3 text-xs hover:bg-white/10 text-white/70 hover:text-white transition-all duration-300"
                                onClick={() => speakText(message.text)}
                                disabled={isMuted}
                              >
                                <Radio className="h-3 w-3 mr-1" />
                                Speak
                              </Button>
                              )}
                          </div>
                        </div>
                      </div>
                      {message.sender === "user" && (
                        <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-2.5 rounded-xl shadow-lg">
                          <Fingerprint className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="flex items-start space-x-3">
                      <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2.5 rounded-xl shadow-lg shadow-purple-500/30">
                        <BrainCircuit className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl border border-gray-700 shadow-lg">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          {/* Input - Enhanced */}
          <div className="flex gap-2 p-4 bg-gradient-to-r from-black/60 via-purple-900/20 to-black/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything... I can code, generate images, create websites, and more!"
              className="flex-1 bg-black/30 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-purple-400 transition-all duration-300"
            />
            {speechSupported && (
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isTyping}
                className={`${
                  isListening
                    ? "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg shadow-red-500/30"
                    : "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
                } transition-all duration-300 transform hover:scale-105`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic2 className="h-4 w-4" />}
              </Button>
            )}
            {speechSupported && isSpeaking && (
              <Button
                onClick={stopSpeaking}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:scale-105"
              >
                <VolumeX className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendHorizonal className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </BeamsBackground>

      {/* Bottom Navigation for Mobile */}
      <nav className="bg-black/95 backdrop-blur border-t border-gray-800 md:hidden">
        <div className="flex justify-around py-2">
          <Link href="/solutions" className="flex flex-col items-center py-2 px-3 text-xs">
            <Dna className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Research</span>
          </Link>
          <Link href="/services" className="flex flex-col items-center py-2 px-3 text-xs">
            <Boxes className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Services</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center py-2 px-3 text-xs">
            <ShieldCheck className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">About</span>
          </Link>
          <Link href="/agent-lee" className="flex flex-col items-center py-2 px-3 text-xs">
            <BrainCircuit className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Agent Lee</span>
          </Link>
          <Link href="/contact" className="flex flex-col items-center py-2 px-3 text-xs">
            <Satellite className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Contact</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}