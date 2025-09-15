"use client"

import { useState, useEffect } from "react"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
  Play,
  Square,
  Server,
  LineChart,
  PieChart,
  TrendingDown,
  AlertCircle,
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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [mcpServerStatus, setMcpServerStatus] = useState<'running' | 'stopped' | 'loading'>('stopped')

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

  // Check authentication and fetch data
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/analytics')
      return
    }

    if (status === 'authenticated') {
      // Initial fetch
      fetchAnalytics()

      // Set up real-time updates every 30 seconds
      const interval = setInterval(fetchAnalytics, 30000)

      return () => clearInterval(interval)
    }
  }, [status, router])

  const refreshData = () => {
    setLoading(true)
    fetchAnalytics()
  }

  // Handle loading and unauthenticated states
  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!session) {
    return null
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

  // MCP Server Controls
  const handleMcpServerStart = async () => {
    setMcpServerStatus('loading')
    try {
      // Simulate server start - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      setMcpServerStatus('running')
    } catch (error) {
      console.error('Failed to start MCP server:', error)
      setMcpServerStatus('stopped')
    }
  }

  const handleMcpServerStop = async () => {
    setMcpServerStatus('loading')
    try {
      // Simulate server stop - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMcpServerStatus('stopped')
    } catch (error) {
      console.error('Failed to stop MCP server:', error)
      setMcpServerStatus('running')
    }
  }

  // Chart Component for Hourly Data
  const HourlyChart = ({ data }: { data: { time: string; value: number }[] }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1)
    return (
      <div className="h-32 flex items-end justify-between space-x-1">
        {data.slice(-12).map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-1 flex-1">
            <div
              className="bg-gradient-to-t from-purple-500 to-purple-300 w-full rounded-t transition-all duration-300 hover:from-purple-400 hover:to-purple-200"
              style={{ height: `${Math.max((item.value / maxValue) * 100, 2)}%` }}
              title={`${item.time}: ${item.value} messages`}
            />
            <span className="text-xs text-gray-400 transform rotate-45 origin-left whitespace-nowrap">
              {item.time.split(':')[0]}h
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Response Time Chart
  const ResponseTimeChart = ({ data }: { data: { time: string; value: number }[] }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1)
    return (
      <div className="h-20 flex items-end justify-between space-x-1">
        {data.slice(-8).map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-1 flex-1">
            <div
              className="bg-gradient-to-t from-cyan-500 to-cyan-300 w-full rounded-t"
              style={{ height: `${Math.max((item.value / maxValue) * 100, 5)}%` }}
              title={`${item.time}: ${item.value}s response time`}
            />
          </div>
        ))}
      </div>
    )
  }

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
              {session ? (
                <>
                  <Link href="/dashboard" className="text-white hover:text-purple-400 transition-colors">
                    Dashboard
                  </Link>
                  <Button
                    onClick={() => router.push('/auth/signin')}
                    variant="outline"
                    size="sm"
                    className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                  >
                    {session.user.name || 'Account'}
                  </Button>
                </>
              ) : (
                <Link href="/auth/signin" className="text-white hover:text-purple-400 transition-colors">
                  Sign In
                </Link>
              )}
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
                <Link href="/analytics" className="text-purple-400 font-medium">
                  Analytics
                </Link>
                <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
                  Agent Lee
                </Link>
                {session && (
                  <Link href="/dashboard" className="text-white hover:text-purple-400 transition-colors">
                    Dashboard
                  </Link>
                )}
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
            <div>
              {/* MCP Server Management */}
              <div className="mb-8">
              <Card className="bg-black/30 border-white/20 hover:border-yellow-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Server className="h-6 w-6 text-yellow-300" />
                      </div>
                      <div>
                        <CardTitle className="text-white">MCP Server Management</CardTitle>
                        <CardDescription className="text-gray-300">Control Model Context Protocol server</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        mcpServerStatus === 'running' ? 'bg-green-400 animate-pulse' :
                        mcpServerStatus === 'loading' ? 'bg-yellow-400 animate-pulse' :
                        'bg-red-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        mcpServerStatus === 'running' ? 'text-green-300' :
                        mcpServerStatus === 'loading' ? 'text-yellow-300' :
                        'text-red-300'
                      }`}>
                        {mcpServerStatus === 'running' ? 'Running' :
                         mcpServerStatus === 'loading' ? 'Loading...' :
                         'Stopped'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleMcpServerStart}
                      disabled={mcpServerStatus === 'running' || mcpServerStatus === 'loading'}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Server
                    </Button>
                    <Button
                      onClick={handleMcpServerStop}
                      disabled={mcpServerStatus === 'stopped' || mcpServerStatus === 'loading'}
                      className="bg-red-600 hover:bg-red-700 text-white flex-1"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop Server
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Hourly Activity Chart */}
              <Card className="bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <LineChart className="h-6 w-6 text-purple-300" />
                    </div>
                    <div>
                      <CardTitle className="text-white">24-Hour Activity</CardTitle>
                      <CardDescription className="text-gray-300">Messages per hour (last 12 hours)</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {analyticsData?.usage.hourlyData ? (
                    <HourlyChart data={analyticsData.usage.hourlyData} />
                  ) : (
                    <div className="h-32 flex items-center justify-center">
                      <span className="text-gray-500">No data available</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Response Time Trends */}
              <Card className="bg-black/30 border-white/20 hover:border-cyan-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <Activity className="h-6 w-6 text-cyan-300" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Response Time Trends</CardTitle>
                      <CardDescription className="text-gray-300">Average response time (seconds)</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {analyticsData?.usage.responseTimeData ? (
                    <ResponseTimeChart data={analyticsData.usage.responseTimeData} />
                  ) : (
                    <div className="h-20 flex items-center justify-center">
                      <span className="text-gray-500">No data available</span>
                    </div>
                  )}
                  <div className="mt-4 text-sm text-gray-400">
                    Avg: {Math.round(analyticsData?.overview.avgResponseTime / 1000 || 0)}s
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* User Growth */}
              <Card className="bg-black/30 border-white/20 hover:border-emerald-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-emerald-300" />
                    </div>
                    <CardTitle className="text-white text-sm">User Growth</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    +{analyticsData?.overview.newUsers || 0}
                  </div>
                  <p className="text-gray-400 text-xs">New users today</p>
                </CardContent>
              </Card>

              {/* Success Rates */}
              <Card className="bg-black/30 border-white/20 hover:border-violet-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-violet-500/20 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-violet-300" />
                    </div>
                    <CardTitle className="text-white text-sm">Success Rate</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {analyticsData ? Math.round(
                      ((analyticsData.features.codeGeneration.success + analyticsData.features.imageGeneration.success) /
                       (analyticsData.features.codeGeneration.total + analyticsData.features.imageGeneration.total)) * 100
                    ) : 0}%
                  </div>
                  <p className="text-gray-400 text-xs">Overall task success</p>
                </CardContent>
              </Card>

              {/* Peak Performance */}
              <Card className="bg-black/30 border-white/20 hover:border-amber-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Zap className="h-5 w-5 text-amber-300" />
                    </div>
                    <CardTitle className="text-white text-sm">Peak Hour</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {analyticsData?.usage.peakHour || '--:--'}
                  </div>
                  <p className="text-gray-400 text-xs">Highest activity</p>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="bg-black/30 border-white/20 hover:border-red-400/50 backdrop-blur-sm transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-300" />
                    </div>
                    <CardTitle className="text-white text-sm">System Health</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {error ? 'ERROR' : 'GOOD'}
                  </div>
                  <p className="text-gray-400 text-xs">
                    {error ? 'Check logs' : 'All systems operational'}
                  </p>
                </CardContent>
              </Card>
            </div>
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