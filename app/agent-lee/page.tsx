"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Mic, MicOff, MessageSquare, X, ChevronLeft, ChevronRight, Menu, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"

interface Message {
  id: number
  text: string
  sender: "user" | "agent"
  timestamp: Date
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

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function AgentLeePage() {
  const [apiProvider, setApiProvider] = useState<'openai' | 'mistral' | 'deepseek' | 'claude'>('claude')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleListening = () => {
    if (!speechSupported) return

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const speakText = (text: string) => {
    if (!ttsEnabled) {
      console.log("TTS is disabled")
      return
    }

    if (!('speechSynthesis' in window)) {
      console.log("Speech synthesis not supported")
      return
    }

    console.log("Speaking text:", text.substring(0, 50) + "...")

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8
    utterance.lang = 'en-US'

    utterance.onstart = () => {
      console.log("TTS started")
      setIsSpeaking(true)
    }
    utterance.onend = () => {
      console.log("TTS ended")
      setIsSpeaking(false)
    }
    utterance.onerror = (event) => {
      console.error("TTS error:", event)
      setIsSpeaking(false)
    }

    // Small delay to ensure proper cancellation
    setTimeout(() => {
      window.speechSynthesis.speak(utterance)
    }, 100)
  }

  const toggleTTS = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
    setTtsEnabled(!ttsEnabled)
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const messageToSend = inputMessage
    setInputMessage("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/agent-lee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          threadId: threadId,
          apiProvider: apiProvider,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.threadId && !threadId) {
        setThreadId(data.threadId)
      }

      let responseText = data.message || data.response

      // If no response and this is an error response, provide helpful guidance
      if (!responseText && data.error) {
        if (apiProvider === 'openai') {
          responseText = "OpenAI API is currently unavailable. I recommend trying Claude, Mistral, or DeepSeek instead."
        } else {
          responseText = `${apiProvider} API is currently unavailable. Please try switching to a different model.`
        }
      } else if (!responseText) {
        responseText = "Sorry, I couldn't process that request."
      }

      const agentMessage: Message = {
        id: Date.now() + 1,
        text: responseText,
        sender: "agent",
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, agentMessage])

      // Speak the agent's response if TTS is enabled
      if (ttsEnabled && responseText) {
        speakText(responseText)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      let errorText = "Sorry, there was an error processing your request."

      if (apiProvider === 'openai') {
        errorText = "OpenAI API key issue detected. Please try Claude, Mistral, or DeepSeek instead."
      } else {
        errorText = `${apiProvider.charAt(0).toUpperCase() + apiProvider.slice(1)} API error. Please try a different model or check your connection.`
      }

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: errorText,
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <h1 className="text-2xl font-bold text-white">NAVADA</h1>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 p-3 rounded-lg min-w-12 min-h-12 flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="transition-transform duration-200">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </div>
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-all duration-200">
                Solutions
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-all duration-200">
                About
              </Link>
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-all duration-200">
                Agent Lee
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-all duration-200">
                Contact
              </Link>
            </nav>
          </div>

          {/* Mobile navigation */}
          <div className={`md:hidden mt-4 pb-4 border-t border-gray-800 pt-4 transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <nav className="flex flex-col space-y-1">
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                Solutions
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                About
              </Link>
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                Agent Lee
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="h-[calc(100vh-80px)] bg-black flex relative overflow-hidden">
        {/* Spline Robot Background - Full Screen */}
      <div className="flex-1 relative">
        <iframe
          src='https://my.spline.design/robotarm-gSWq0a8AI421FLrvVw0YltJY/'
          frameBorder='0'
          width='100%'
          height='100%'
          className="absolute inset-0"
          style={{
            border: 'none',
            pointerEvents: 'none'
          }}
        />
        {/* Overlay to prevent any mouse interactions */}
        <div className="absolute inset-0 pointer-events-none z-10" />
      </div>

      {/* Chat Toggle Arrow */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed top-1/2 right-2 sm:right-4 transform -translate-y-1/2 z-50 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 p-0"
          aria-label="Open chat"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      )}

      {/* Collapsible Chat Interface */}
      <div className={`fixed top-0 right-0 h-full bg-black/95 backdrop-blur-sm border-l border-gray-800 transition-transform duration-300 ease-in-out z-40 ${
        isChatOpen ? 'translate-x-0' : 'translate-x-full'
      } w-full sm:w-96 md:w-96 lg:w-96 flex flex-col`}>

        {/* Chat Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <h1 className="text-base sm:text-lg font-semibold text-white">Agent Lee</h1>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              onClick={toggleTTS}
              variant="ghost"
              size="sm"
              className={`${ttsEnabled ? "text-purple-400" : "text-gray-400"} hover:text-white hover:bg-gray-800`}
              title={ttsEnabled ? "Voice responses enabled - Click to disable" : "Voice responses disabled - Click to enable"}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4 animate-pulse" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Select value={apiProvider} onValueChange={(value: any) => setApiProvider(value)}>
              <SelectTrigger className="w-20 sm:w-28 text-xs sm:text-sm bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="claude" className="text-white hover:bg-gray-700">Claude</SelectItem>
                <SelectItem value="mistral" className="text-white hover:bg-gray-700">Mistral</SelectItem>
                <SelectItem value="deepseek" className="text-white hover:bg-gray-700">DeepSeek</SelectItem>
                <SelectItem value="openai" className="text-white hover:bg-gray-700">GPT-4 ⚠️</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setIsChatOpen(false)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-6 sm:mt-8">
              <p className="text-sm">Start a conversation with Agent Lee</p>
              <p className="text-xs mt-2 text-gray-500">AI assistant for robotics, programming, and more</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs sm:max-w-sm px-3 sm:px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: message.text
                      .replace(/\n\n/g, '</p><p class="mb-3">')
                      .replace(/\n/g, '<br />')
                      .replace(/^/, '<p class="mb-3">')
                      .replace(/$/, '</p>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/`(.*?)`/g, '<code class="bg-gray-600 px-1 py-0.5 rounded text-sm">$1</code>')
                  }}
                />
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 max-w-xs px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message Agent Lee..."
                className="pr-12 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 text-sm sm:text-base"
                disabled={isTyping}
              />
              {speechSupported && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 ${
                    isListening ? "text-red-400" : "text-gray-400"
                  } hover:text-white`}
                  onClick={toggleListening}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
              className="h-10 w-10 p-0 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}