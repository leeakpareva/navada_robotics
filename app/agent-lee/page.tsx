"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Menu,
  X,
  Cog,
  Microscope as Microchip,
  Wrench,
  Shield,
  Phone,
  Bot,
  Send,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: number
  text: string
  sender: "user" | "agent"
  timestamp: Date
}

export default function AgentLeePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Agent Lee, your AI assistant for robotics, deep learning, and computer vision. I'm here to help you learn and explore these exciting fields. What would you like to know about today?",
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef<boolean>(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
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

      if (data.threadId && !threadId) {
        setThreadId(data.threadId)
      }

      const agentResponse: Message = {
        id: messages.length + 2,
        text: data.message,
        sender: "agent",
        timestamp: new Date(),
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

  const quickQuestions = [
    "How do I start with robotics?",
    "Explain computer vision basics",
    "Python for deep learning",
    "Raspberry Pi robot projects",
  ]

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Cog className="h-8 w-8 text-purple-400" />
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
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        {/* Agent Lee Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-600 p-4 rounded-full">
              <Bot className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-purple-300 mb-2">Agent Lee</h2>
          <p className="text-gray-300">Your AI assistant for Robotics, Deep Learning & Computer Vision</p>
          {speechSupported && (
            <div className="flex items-center justify-center mt-2 space-x-2">
              <p className="text-sm text-purple-400">🎤 Voice enabled</p>
              <Button onClick={toggleMute} variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-600/20">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <span className="ml-1 text-xs">{isMuted ? "Unmute" : "Mute"}</span>
              </Button>
            </div>
          )}
        </div>

        {/* Quick Questions */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-3">Quick questions to get started:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs bg-gray-800 border-gray-600 text-gray-300 hover:bg-purple-600 hover:border-purple-500"
                onClick={() => setInputMessage(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <Card className="flex-1 bg-gray-900 border-gray-700 mb-4">
          <CardContent className="p-4 h-96 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md`}>
                    {message.sender === "agent" && (
                      <div className="bg-purple-600 p-2 rounded-full flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {message.sender === "agent" && speechSupported && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-6 px-2 text-xs hover:bg-gray-700"
                          onClick={() => speakText(message.text)}
                          disabled={isMuted}
                        >
                          <Volume2 className="h-3 w-3 mr-1" />
                          Speak
                        </Button>
                      )}
                    </div>
                    {message.sender === "user" && (
                      <div className="bg-gray-600 p-2 rounded-full flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="bg-purple-600 p-2 rounded-full">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
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

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about robotics, deep learning, or computer vision..."
            className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          />
          {speechSupported && (
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isTyping}
              variant="outline"
              className={`border-gray-600 ${isListening ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          {speechSupported && (
            <Button
              onClick={isSpeaking ? stopSpeaking : toggleMute}
              variant="outline"
              className={`border-gray-600 ${isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"}`}
            >
              {isSpeaking ? (
                <VolumeX className="h-4 w-4" />
              ) : isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="bg-black/95 backdrop-blur border-t border-gray-800 md:hidden">
        <div className="flex justify-around py-2">
          <Link href="/solutions" className="flex flex-col items-center py-2 px-3 text-xs">
            <Microchip className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Research</span>
          </Link>
          <Link href="/services" className="flex flex-col items-center py-2 px-3 text-xs">
            <Wrench className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Services</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center py-2 px-3 text-xs">
            <Shield className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">About</span>
          </Link>
          <Link href="/agent-lee" className="flex flex-col items-center py-2 px-3 text-xs">
            <Bot className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Agent Lee</span>
          </Link>
          <Link href="/contact" className="flex flex-col items-center py-2 px-3 text-xs">
            <Phone className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Contact</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
