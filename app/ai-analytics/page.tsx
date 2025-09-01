"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BeamsBackground } from "@/components/ui/beams-background"
import {
  Menu,
  X,
  TrendingUp,
  MessageSquare,
  Clock,
  Users,
  Brain,
  BarChart3,
  Activity,
  Zap,
  Microscope as Microchip,
  Wrench,
  Shield,
  Phone,
} from "lucide-react"
import Link from "next/link"

export default function AIAnalyticsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Mock data for charts
  const responseTimeData = [
    { time: "00:00", value: 1.2 },
    { time: "04:00", value: 0.8 },
    { time: "08:00", value: 2.1 },
    { time: "12:00", value: 3.4 },
    { time: "16:00", value: 2.8 },
    { time: "20:00", value: 1.9 },
  ]

  const satisfactionData = [
    { label: "Excellent", value: 45, color: "#8b5cf6" },
    { label: "Good", value: 32, color: "#a855f7" },
    { label: "Fair", value: 18, color: "#c084fc" },
    { label: "Poor", value: 5, color: "#ddd6fe" },
  ]

  return (
    <div className="min-h-screen bg-black">
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
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
                Agent Lee
              </Link>
              <Link href="/ai-analytics" className="text-purple-400 font-medium">
                AI Analytics
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
                <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
                  Agent Lee
                </Link>
                <Link href="/ai-analytics" className="text-purple-400 font-medium">
                  AI Analytics
                </Link>
                <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* AI Analytics Dashboard */}
      <BeamsBackground intensity="subtle" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">AI Analytics Dashboard</h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Real-time performance insights and chat analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chat Volume Chart */}
            <Card className="bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-300" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Chat Volume</CardTitle>
                    <CardDescription className="text-gray-300">24h conversation trends</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end space-x-2">
                  {[45, 78, 52, 89, 67, 92, 74, 83, 95, 71, 88, 64].map((height, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t flex-1 transition-all duration-300 hover:from-purple-500 hover:to-purple-300"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-400">
                  <span>12AM</span>
                  <span>6AM</span>
                  <span>12PM</span>
                  <span>6PM</span>
                  <span>11PM</span>
                </div>
              </CardContent>
            </Card>

            {/* Response Time Metrics */}
            <Card className="bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-300" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Response Time</CardTitle>
                    <CardDescription className="text-gray-300">Average: 1.8s</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-48 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,150 Q100,120 200,100 T400,80"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M0,150 Q100,120 200,100 T400,80 L400,200 L0,200 Z"
                      fill="url(#gradient)"
                    />
                  </svg>
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-400">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                </div>
              </CardContent>
            </Card>

            {/* User Satisfaction */}
            <Card className="bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-300" />
                  </div>
                  <div>
                    <CardTitle className="text-white">User Satisfaction</CardTitle>
                    <CardDescription className="text-gray-300">Feedback ratings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset="62.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">87%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {satisfactionData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-300">{item.label}</span>
                      </div>
                      <span className="text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card className="bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Users className="h-6 w-6 text-purple-300" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Active Users</CardTitle>
                    <CardDescription className="text-gray-300">Real-time activity</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex flex-col justify-center space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-300 mb-2">1,247</div>
                    <div className="text-sm text-gray-400">Current active users</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Online Now</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-medium">1,247</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">This Hour</span>
                      <span className="text-purple-300 font-medium">3,891</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Today</span>
                      <span className="text-purple-300 font-medium">12,456</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics Summary */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <Activity className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1.2s</div>
              <div className="text-sm text-gray-400">Avg Response</div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">45K</div>
              <div className="text-sm text-gray-400">Daily Queries</div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <Brain className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">92%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
          </div>
        </div>
      </BeamsBackground>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-gray-800 md:hidden">
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
          <Link href="/ai-analytics" className="flex flex-col items-center py-2 px-3 text-xs">
            <BarChart3 className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Analytics</span>
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