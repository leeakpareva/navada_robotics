"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BeamsBackground } from "@/components/ui/beams-background"
import { Menu, X, ShieldCheck, SendHorizonal, UserCircle2, Mic2, MicOff, AudioLines, VolumeX, BrainCircuit, Dna, Fingerprint, Radio, Lock, Download, FileDown, Home, ArrowLeft, LogOut, Newspaper, Infinity as InfinityIcon } from "lucide-react"
import Link from "next/link"


interface SpeechSynthesisErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
}

interface Message {
  id: number
  text: string
  sender: "user" | "agent"
  timestamp: Date
  image?: string // Base64 data URL for images
  website?: Record<string, unknown> // Website generation data
}

export default function AgentLeePage() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [apiProvider, setApiProvider] = useState<'openai' | 'deepseek'>('openai')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Agent Lee, your AI powerhouse for robotics, deep learning, and computer vision!\n\nEnhanced Features Now Available:\n• Robotics guidance with knowledge base (RAG-powered)\n• Python programming instruction with examples\n• Computer vision and OpenCV help\n• DALL-E 3 image generation (say \"generate image\")\n• NextJS website creation (say \"create website\")\n• Persistent chat history - all conversations saved!\n• Smart context - I remember our previous discussions\n• Real-time analytics - track your learning progress\n• Knowledge base search - enhanced with expert robotics content\n\nTry asking: \"What's the best way to start with Raspberry Pi robotics?\" to see the knowledge base in action!\n\nWhat amazing things shall we build today?",
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
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef<boolean>(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition && window.speechSynthesis) {
        setSpeechSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
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

  // Load chat history when user is authenticated
  useEffect(() => {
    if (session && threadId) {
      loadChatHistory()
    }
  }, [session, threadId])

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

      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
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

  const handleSignOut = async () => {
    try {
      // End session if exists
      if (threadId) {
        await fetch('/api/agent-lee/end-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ threadId }),
        })
      }
    } catch (error) {
      console.error('Error ending session:', error)
    }
    await signOut({ callbackUrl: '/' })
  }


  const loadChatHistory = async () => {
    if (!threadId) return

    try {
      const response = await fetch(`/api/agent-lee/history/${threadId}`)
      if (response.ok) {
        const history = await response.json()
        if (history && history.length > 0) {
          setMessages(history)
          console.log(`Loaded ${history.length} previous messages`)
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
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

  

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <BeamsBackground intensity="subtle" className="absolute inset-0" />
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 p-4 rounded-xl shadow-xl shadow-purple-500/50 animate-pulse">
              <BrainCircuit className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-white text-lg">Loading Agent Lee...</p>
        </div>
      </div>
    )
  }

  // Redirect to signin if not authenticated
  if (!session) {
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Authentication Required
                </h2>
                <p className="text-white/70 text-sm">Please create an account to access Agent Lee</p>
              </div>

              <div className="space-y-3">
                <Link href="/auth/signup">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-105">
                    <UserCircle2 className="h-4 w-4 mr-2" />
                    Create Account to Access Agent Lee
                  </Button>
                </Link>

                <Link href="/">
                  <Button
                    variant="ghost"
                    className="w-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Return to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
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
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                About
              </Link>
              <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                Learning
              </Link>
              <Link href="/agent-lee" className="text-purple-400 font-medium">
                Agent Lee
              </Link>
              <Link href="/agent-lee/analytics" className="text-white hover:text-purple-400 transition-colors">
                Analytics
              </Link>
              <Link href="/dashboard" className="text-white hover:text-purple-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                Contact
              </Link>

              {/* User Welcome & Session Management */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <UserCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="text-white font-medium">Welcome back!</p>
                    <p className="text-purple-300 text-xs">{session?.user?.name || session?.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                </div>
              </div>
            </nav>
          </div>

          {/* Mobile navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
              <div className="flex flex-col space-y-3">
                <Link href="/solutions" className="text-white hover:text-purple-400 transition-colors">
                  Solutions
                </Link>
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                  About
                </Link>
                <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                  Learning
                </Link>
                <Link href="/agent-lee" className="text-purple-400 font-medium">
                  Agent Lee
                </Link>
                <Link href="/agent-lee/analytics" className="text-white hover:text-purple-400 transition-colors">
                  Analytics
                </Link>
                <Link href="/dashboard" className="text-white hover:text-purple-400 transition-colors">
                  Dashboard
                </Link>
                <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                  Contact
                </Link>

                {/* Mobile User Info */}
                <div className="pt-3 border-t border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <UserCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-sm">
                      <p className="text-white font-medium">Welcome back!</p>
                      <p className="text-purple-300 text-xs">{session?.user?.name || session?.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
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
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-6 md:py-8">
          {/* Agent Lee Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
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


          {/* Messages - Enhanced UI */}
          <Card className="flex-1 bg-gradient-to-br from-black/40 via-purple-900/10 to-black/40 backdrop-blur-sm border-white/20 mb-4 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
            <CardContent className="p-4 md:p-6 h-[400px] md:h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600/50 scrollbar-track-transparent">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
                    <div className={`flex items-start space-x-3 max-w-[80%]`}>
                      {message.sender === "agent" && (
                        <div className="relative">
                          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2.5 rounded-xl shadow-lg shadow-purple-500/30">
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
                                <InfinityIcon className="h-5 w-5 text-cyan-400" />
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
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
      <nav className="bg-black/95 backdrop-blur md:hidden flex-shrink-0 border-t border-gray-800">
        <div className="flex justify-around py-1">
          <Link href="/solutions" className="flex flex-col items-center py-1.5 px-3 text-xs">
            <Dna className="h-4 w-4 text-gray-400 mb-0.5" />
            <span className="text-gray-400">Research</span>
          </Link>
          <Link href="/news" className="flex flex-col items-center py-1.5 px-3 text-xs">
            <Newspaper className="h-4 w-4 text-gray-400 mb-0.5" />
            <span className="text-gray-400">News</span>
          </Link>
          <Link href="/agent-lee" className="flex flex-col items-center py-1.5 px-3 text-xs">
            <BrainCircuit className="h-4 w-4 text-purple-400 mb-0.5" />
            <span className="text-purple-400 text-xs">Agent</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center py-1.5 px-3 text-xs">
            <ShieldCheck className="h-4 w-4 text-gray-400 mb-0.5" />
            <span className="text-gray-400">About</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}