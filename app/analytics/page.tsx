"use client"

import { useState, useEffect } from "react"
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
  Image,
  Code,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

interface AnalyticsData {
  overview: {
    totalSessions: number
    activeSessions: number
    totalMessages: number
    avgResponseTime: number
    totalUsers: number
    newUsers: number
  }
  usage: {
    hourlyData: { time: string; value: number }[]
    responseTimeData: { time: string; value: number }[]
    peakHour: string
    avgSessionLength: number
  }
  satisfaction: { excellent: number; good: number; fair: number; poor: number }
  features: {
    codeGeneration: {
      total: number
      success: number
      avgTime: number
    }
    imageGeneration: {
      total: number
      success: number
      avgTime: number
    }
  }
}

export default function AnalyticsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAnalytics = async () => {
    try {
      setError(null)
      const response = await fetch('/api/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`)
      }

      const data = await response.json()
      setAnalyticsData(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Analytics fetch error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchAnalytics()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)

    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    setLoading(true)
    fetchAnalytics()
  }

  // Transform satisfaction data for display
  const satisfactionData = analyticsData?.satisfaction ? [
    { label: "Excellent", value: analyticsData.satisfaction.excellent, color: "#8b5cf6" },
    { label: "Good", value: analyticsData.satisfaction.good, color: "#a855f7" },
    { label: "Fair", value: analyticsData.satisfaction.fair, color: "#c084fc" },
    { label: "Poor", value: analyticsData.satisfaction.poor, color: "#ddd6fe" },
  ] : []

  const satisfactionPercentage = analyticsData?.satisfaction
    ? analyticsData.satisfaction.excellent + analyticsData.satisfaction.good
    : 0

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
              <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                Learning
              </Link>
              <Link href="/analytics" className="text-purple-400 font-medium">
                Analytics
              </Link>
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
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
                <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                  Learning
                </Link>
                <Link href="/analytics" className="text-purple-400 font-medium">
                  Analytics
                </Link>
                <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
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

      {/* Analytics Dashboard */}
      <BeamsBackground intensity="subtle" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Analytics Dashboard</h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Real-time insights into Agent Lee performance and user interactions
            </p>

            {/* Refresh Controls */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <Button
                onClick={refreshData}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              {lastUpdated && (
                <span className="text-sm text-gray-400">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8 text-center">
              <p className="text-red-300">Error loading analytics: {error}</p>
              <Button onClick={refreshData} className="mt-2 bg-red-600 hover:bg-red-700">
                Retry
              </Button>
            </div>
          )}

          {loading && !analyticsData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-black/30 border-white/20 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-8 bg-gray-700 rounded mb-4"></div>
                    <div className="h-20 bg-gray-600 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : analyticsData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Sessions */}
              <Card className="bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Users className="h-6 w-6 text-purple-300" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Total Sessions</CardTitle>
                      <CardDescription className="text-gray-300">Chat sessions created</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {analyticsData.overview.totalSessions.toLocaleString()}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Active: {analyticsData.overview.activeSessions}
                  </p>
                </CardContent>
              </Card>

              {/* Total Messages */}
              <Card className="bg-black/30 border-white/20 hover:border-cyan-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-cyan-300" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Total Messages</CardTitle>
                      <CardDescription className="text-gray-300">Conversations handled</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {analyticsData.overview.totalMessages.toLocaleString()}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Avg response: {Math.round(analyticsData.overview.avgResponseTime / 1000)}s
                  </p>
                </CardContent>
              </Card>

              {/* User Satisfaction */}
              <Card className="bg-black/30 border-white/20 hover:border-pink-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-pink-300" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Satisfaction</CardTitle>
                      <CardDescription className="text-gray-300">User feedback ratings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="8"
                          strokeDasharray="251.2" strokeDashoffset={251.2 - (satisfactionPercentage / 100) * 251.2}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{satisfactionPercentage}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {satisfactionData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-300">{item.label}</span>
                        </div>
                        <span className="text-white">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Code Generation */}
              <Card className="bg-black/30 border-white/20 hover:border-green-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Code className="h-6 w-6 text-green-300" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Code Generation</CardTitle>
                      <CardDescription className="text-gray-300">Generated code requests</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {analyticsData.features.codeGeneration.total.toLocaleString()}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Success: {analyticsData.features.codeGeneration.success}
                    ({Math.round((analyticsData.features.codeGeneration.success / analyticsData.features.codeGeneration.total) * 100)}%)
                  </p>
                </CardContent>
              </Card>

              {/* Image Generation */}
              <Card className="bg-black/30 border-white/20 hover:border-orange-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Image className="h-6 w-6 text-orange-300" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Image Generation</CardTitle>
                      <CardDescription className="text-gray-300">AI-generated images</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {analyticsData.features.imageGeneration.total.toLocaleString()}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Success: {analyticsData.features.imageGeneration.success}
                    ({Math.round((analyticsData.features.imageGeneration.success / analyticsData.features.imageGeneration.total) * 100)}%)
                  </p>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="bg-black/30 border-white/20 hover:border-blue-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-300" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Performance</CardTitle>
                      <CardDescription className="text-gray-300">System response metrics</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {Math.round(analyticsData.overview.avgResponseTime / 1000)}s
                  </div>
                  <p className="text-gray-400 text-sm">
                    Peak hour: {analyticsData.usage.peakHour}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Avg session: {Math.round(analyticsData.usage.avgSessionLength / 60)}min
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : null}
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
          <Link href="/analytics" className="flex flex-col items-center py-2 px-3 text-xs">
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