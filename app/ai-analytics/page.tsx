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
  Newspaper,
  Image,
  Palette,
  Server,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Settings,
} from "lucide-react"
import Link from "next/link"

interface AnalyticsData {
  chatVolume: { time: string; value: number }[];
  responseTimeData: { time: string; value: number }[];
  activeUsers: { current: number; thisHour: number; today: number };
  satisfaction: { excellent: number; good: number; fair: number; poor: number };
  dailyQueries: number;
  uptime: number;
  accuracy: number;
  avgResponseTime: number;
  imageGeneration: {
    totalGenerated: number;
    successRate: number;
    avgGenerationTime: number;
    hourlyData: { time: string; value: number }[];
    topPrompts: { prompt: string; count: number }[];
  };
}

interface MCPServerStatus {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error' | 'connecting';
  category: string;
  requiresApiKey: boolean;
  tools: Array<{
    name: string;
    description: string;
    enabled: boolean;
    usageCount: number;
  }>;
  lastHealthCheck?: string;
  responseTime?: number;
}

interface MCPStats {
  totalServers: number;
  activeServers: number;
  totalCalls: number;
  successRate: number;
  avgResponseTime: number;
}

export default function AIAnalyticsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mcpServers, setMcpServers] = useState<MCPServerStatus[]>([])
  const [mcpStats, setMcpStats] = useState<MCPStats | null>(null)
  const [activeTab, setActiveTab] = useState<'analytics' | 'mcp'>('analytics')

  // Fetch real analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/analytics')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        const data = await response.json()
        setAnalyticsData(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Analytics fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    const fetchMCPData = async () => {
      try {
        // Fetch MCP servers
        const serversResponse = await fetch('/api/mcp/servers')
        if (serversResponse.ok) {
          const serversData = await serversResponse.json()
          setMcpServers(serversData.servers || [])
        }

        // Fetch MCP stats
        const statsResponse = await fetch('/api/mcp/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setMcpStats(statsData)
        }
      } catch (err) {
        console.error('MCP fetch error:', err)
      }
    }

    fetchAnalytics()
    fetchMCPData()

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchAnalytics()
      fetchMCPData()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Transform satisfaction data for display
  const satisfactionData = analyticsData ? [
    { label: "Excellent", value: analyticsData.satisfaction.excellent, color: "#8b5cf6" },
    { label: "Good", value: analyticsData.satisfaction.good, color: "#a855f7" },
    { label: "Fair", value: analyticsData.satisfaction.fair, color: "#c084fc" },
    { label: "Poor", value: analyticsData.satisfaction.poor, color: "#ddd6fe" },
  ] : []

  // Calculate satisfaction percentage for display
  const satisfactionPercentage = analyticsData ? analyticsData.satisfaction.excellent + analyticsData.satisfaction.good : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'connecting':
        return <RefreshCw className="h-5 w-5 text-yellow-400 animate-spin" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-green-400/50 bg-green-400/10'
      case 'connecting':
        return 'border-yellow-400/50 bg-yellow-400/10'
      case 'error':
        return 'border-red-400/50 bg-red-400/10'
      default:
        return 'border-gray-400/50 bg-gray-400/10'
    }
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
              <Link href="/services" className="text-white hover:text-purple-400 transition-colors">
                Services
              </Link>
              <Link href="/news" className="text-white hover:text-purple-400 transition-colors font-semibold">
                News
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                About
              </Link>
              <Link href="/ai-analytics" className="text-purple-400 font-medium">
                AI Analytics
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
                <Link href="/news" className="text-white hover:text-purple-400 transition-colors font-semibold">
                  News
                </Link>
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                  About
                </Link>
                <Link href="/ai-analytics" className="text-purple-400 font-medium">
                  AI Analytics
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

      {/* AI Analytics Dashboard */}
      <BeamsBackground intensity="subtle" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4 animate-pulse">
              AI Analytics & MCP Dashboard
            </h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Real-time performance insights, chat analytics, and MCP server monitoring
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-8 flex justify-center space-x-4">
              <Button
                onClick={() => setActiveTab('analytics')}
                className={`${activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'} hover:bg-purple-700 transition-all duration-300`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Chat Analytics
              </Button>
              <Button
                onClick={() => setActiveTab('mcp')}
                className={`${activeTab === 'mcp' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'} hover:bg-purple-700 transition-all duration-300`}
              >
                <Server className="h-4 w-4 mr-2" />
                MCP Servers
              </Button>
            </div>
          </div>

          {/* Analytics Tab Content */}
          {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Chat Volume Chart */}
            <Card className="bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg animate-pulse">
                    <MessageSquare className="h-6 w-6 text-purple-300" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Chat Volume</CardTitle>
                    <CardDescription className="text-gray-300">24h conversation trends</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-gray-400">Loading chart data...</div>
                  </div>
                ) : error ? (
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-red-400">Error loading data</div>
                  </div>
                ) : (
                  <div className="h-48 flex items-end space-x-2">
                    {(analyticsData?.chatVolume || []).map((data, i) => {
                      const maxValue = Math.max(...(analyticsData?.chatVolume || []).map(d => d.value))
                      const height = maxValue > 0 ? (data.value / maxValue) * 100 : 0
                      return (
                        <div
                          key={i}
                          className="bg-gradient-to-t from-purple-600 via-pink-500 to-cyan-400 rounded-t flex-1 transition-all duration-300 hover:from-purple-500 hover:to-cyan-300 hover:scale-105 animate-pulse"
                          style={{
                            height: `${Math.max(height, 5)}%`,
                            animationDelay: `${i * 100}ms`,
                            animationDuration: '2s'
                          }}
                          title={`${data.time}: ${data.value} chats`}
                        />
                      )
                    })}
                  </div>
                )}
                <div className="mt-4 flex justify-between text-sm text-gray-400">
                  {analyticsData && analyticsData.chatVolume.length >= 5 && (
                    <>
                      <span>{analyticsData.chatVolume[0]?.time || '00:00'}</span>
                      <span>{analyticsData.chatVolume[Math.floor(analyticsData.chatVolume.length * 0.25)]?.time || '06:00'}</span>
                      <span>{analyticsData.chatVolume[Math.floor(analyticsData.chatVolume.length * 0.5)]?.time || '12:00'}</span>
                      <span>{analyticsData.chatVolume[Math.floor(analyticsData.chatVolume.length * 0.75)]?.time || '18:00'}</span>
                      <span>{analyticsData.chatVolume[analyticsData.chatVolume.length - 1]?.time || '23:59'}</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Response Time Metrics */}
            <Card className="bg-black/30 border-white/20 hover:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-lg">
                    <Clock className="h-6 w-6 text-cyan-300" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Response Time</CardTitle>
                    <CardDescription className="text-gray-300">
                      Average: {analyticsData?.avgResponseTime ? `${analyticsData.avgResponseTime}s` : '0s'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-gray-400">Loading response time data...</div>
                  </div>
                ) : error ? (
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-red-400">Error loading data</div>
                  </div>
                ) : (
                  <div className="h-48 relative">
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                      {analyticsData?.responseTimeData && analyticsData.responseTimeData.length > 0 && (
                        <>
                          <path
                            d={`M0,${200 - (analyticsData.responseTimeData[0]?.value || 0) * 40} ${analyticsData.responseTimeData.map((point, i) =>
                              `L${(i / (analyticsData.responseTimeData.length - 1)) * 400},${200 - point.value * 40}`
                            ).join(' ')}`}
                            stroke="url(#lineGradient)"
                            strokeWidth="3"
                            fill="none"
                            className="animate-pulse"
                          />
                          <path
                            d={`M0,${200 - (analyticsData.responseTimeData[0]?.value || 0) * 40} ${analyticsData.responseTimeData.map((point, i) =>
                              `L${(i / (analyticsData.responseTimeData.length - 1)) * 400},${200 - point.value * 40}`
                            ).join(' ')} L400,200 L0,200 Z`}
                            fill="url(#gradient)"
                          />
                        </>
                      )}
                    </svg>
                  </div>
                )}
                <div className="mt-4 flex justify-between text-sm text-gray-400">
                  {analyticsData?.responseTimeData && analyticsData.responseTimeData.length > 0 && (
                    <>
                      <span>{analyticsData.responseTimeData[0]?.time || '00:00'}</span>
                      <span>{analyticsData.responseTimeData[Math.floor(analyticsData.responseTimeData.length * 0.33)]?.time || '08:00'}</span>
                      <span>{analyticsData.responseTimeData[Math.floor(analyticsData.responseTimeData.length * 0.66)]?.time || '16:00'}</span>
                      <span>{analyticsData.responseTimeData[analyticsData.responseTimeData.length - 1]?.time || '23:59'}</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Satisfaction */}
            <Card className="bg-black/30 border-white/20 hover:border-pink-400/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-pink-300 animate-bounce" />
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
                      <defs>
                        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
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
                        stroke="url(#circleGradient)"
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset="62.8"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                        {satisfactionPercentage}%
                      </span>
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
            <Card className="bg-black/30 border-white/20 hover:border-green-400/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-lg animate-pulse">
                    <Users className="h-6 w-6 text-green-300" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Active Users</CardTitle>
                    <CardDescription className="text-gray-300">Real-time activity</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-gray-400">Loading user data...</div>
                  </div>
                ) : error ? (
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-red-400">Error loading data</div>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col justify-center space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 animate-pulse">
                        {analyticsData?.activeUsers.current.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-gray-400">Current active users</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Online Now</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                          <span className="text-green-300 font-medium">
                            {analyticsData?.activeUsers.current.toLocaleString() || '0'}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">This Hour</span>
                        <span className="text-emerald-300 font-medium">
                          {analyticsData?.activeUsers.thisHour.toLocaleString() || '0'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Today</span>
                        <span className="text-emerald-300 font-medium">
                          {analyticsData?.activeUsers.today.toLocaleString() || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Generation Analytics */}
            <Card className="bg-black/30 border-white/20 hover:border-orange-400/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 lg:col-span-3">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-lg animate-pulse">
                    <Image className="h-6 w-6 text-orange-300" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Image Generation Analytics</CardTitle>
                    <CardDescription className="text-gray-300">DALL-E 3 performance and usage</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-gray-400">Loading image generation data...</div>
                  </div>
                ) : error ? (
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-red-400">Error loading data</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Image Generation Chart */}
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-300 mb-4">Hourly Image Generation (24h)</h4>
                      <div className="h-40 flex items-end space-x-1">
                        {(analyticsData?.imageGeneration.hourlyData || []).map((data, i) => {
                          const maxValue = Math.max(...(analyticsData?.imageGeneration.hourlyData || []).map(d => d.value))
                          const height = maxValue > 0 ? (data.value / maxValue) * 100 : 0
                          return (
                            <div
                              key={i}
                              className="bg-gradient-to-t from-orange-600 via-red-500 to-pink-400 rounded-t flex-1 transition-all duration-300 hover:from-orange-500 hover:to-pink-300 hover:scale-105"
                              style={{
                                height: `${Math.max(height, 5)}%`,
                                animationDelay: `${i * 50}ms`,
                              }}
                              title={`${data.time}: ${data.value} images`}
                            />
                          )
                        })}
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-400">
                        {analyticsData?.imageGeneration.hourlyData && analyticsData.imageGeneration.hourlyData.length >= 5 && (
                          <>
                            <span>{analyticsData.imageGeneration.hourlyData[0]?.time || '00:00'}</span>
                            <span>{analyticsData.imageGeneration.hourlyData[Math.floor(analyticsData.imageGeneration.hourlyData.length * 0.25)]?.time || '06:00'}</span>
                            <span>{analyticsData.imageGeneration.hourlyData[Math.floor(analyticsData.imageGeneration.hourlyData.length * 0.5)]?.time || '12:00'}</span>
                            <span>{analyticsData.imageGeneration.hourlyData[Math.floor(analyticsData.imageGeneration.hourlyData.length * 0.75)]?.time || '18:00'}</span>
                            <span>{analyticsData.imageGeneration.hourlyData[analyticsData.imageGeneration.hourlyData.length - 1]?.time || '23:59'}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Image Stats and Top Prompts */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="text-center p-4 bg-black/20 rounded-lg border border-orange-400/20">
                          <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                            {analyticsData?.imageGeneration.totalGenerated.toLocaleString() || '0'}
                          </div>
                          <div className="text-xs text-gray-400">Images Generated (24h)</div>
                        </div>

                        <div className="text-center p-4 bg-black/20 rounded-lg border border-green-400/20">
                          <div className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            {analyticsData?.imageGeneration.successRate || 0}%
                          </div>
                          <div className="text-xs text-gray-400">Success Rate</div>
                        </div>

                        <div className="text-center p-4 bg-black/20 rounded-lg border border-blue-400/20">
                          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {analyticsData?.imageGeneration.avgGenerationTime || 0}s
                          </div>
                          <div className="text-xs text-gray-400">Avg Generation Time</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Top Prompts</h5>
                        <div className="space-y-2">
                          {(analyticsData?.imageGeneration.topPrompts || []).map((prompt, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                <Palette className="h-3 w-3 text-orange-400" />
                                <span className="text-gray-300 truncate" title={prompt.prompt}>
                                  {prompt.prompt}
                                </span>
                              </div>
                              <span className="text-orange-300 font-medium">{prompt.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          )}

          {/* MCP Tab Content */}
          {activeTab === 'mcp' && (
            <div>
              {/* MCP Stats Overview */}
              {mcpStats && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
                    <Server className="h-8 w-8 text-purple-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{mcpStats.totalServers}</div>
                    <div className="text-sm text-gray-400">Total Servers</div>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center hover:border-green-400/50 transition-all duration-300 hover:scale-105">
                    <Activity className="h-8 w-8 text-green-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-2xl font-bold text-green-400">{mcpStats.activeServers}</div>
                    <div className="text-sm text-gray-400">Active Servers</div>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
                    <BarChart3 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{mcpStats.totalCalls}</div>
                    <div className="text-sm text-gray-400">Total Calls</div>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center hover:border-emerald-400/50 transition-all duration-300 hover:scale-105">
                    <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-emerald-400">{mcpStats.successRate}%</div>
                    <div className="text-sm text-gray-400">Success Rate</div>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                    <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2 animate-bounce" />
                    <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{mcpStats.avgResponseTime}ms</div>
                    <div className="text-sm text-gray-400">Avg Response</div>
                  </div>
                </div>
              )}

              {/* MCP Server List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mcpServers.map((server) => (
                  <Card
                    key={server.id}
                    className={`bg-black/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 border-white/20 ${getStatusColor(server.status)}`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(server.status)}
                          <div>
                            <CardTitle className="text-white">{server.name}</CardTitle>
                            <CardDescription className="text-gray-300">{server.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-gray-700"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Category:</span>
                          <span className="text-white capitalize">{server.category}</span>
                        </div>

                        {server.responseTime && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Response Time:</span>
                            <span className="text-white">{server.responseTime}ms</span>
                          </div>
                        )}

                        {server.lastHealthCheck && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Last Check:</span>
                            <span className="text-white">
                              {new Date(server.lastHealthCheck).toLocaleTimeString()}
                            </span>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Available Tools ({server.tools.length})</h4>
                          <div className="space-y-1">
                            {server.tools.slice(0, 3).map((tool, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${tool.enabled ? 'bg-green-400' : 'bg-gray-500'}`} />
                                  <span className="text-gray-300">{tool.name}</span>
                                </div>
                                <span className="text-gray-400">{tool.usageCount || 0} calls</span>
                              </div>
                            ))}
                            {server.tools.length > 3 && (
                              <div className="text-xs text-gray-400">
                                +{server.tools.length - 3} more tools
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            server.status === 'active' ? 'bg-green-100 text-green-800' :
                            server.status === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
                            server.status === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {server.status.toUpperCase()}
                          </span>

                          {server.requiresApiKey && (
                            <span className="text-xs text-amber-400">🔑 API Key Required</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {mcpServers.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Server className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No MCP Servers Found</h3>
                  <p className="text-gray-400">MCP servers will appear here once configured.</p>
                </div>
              )}
            </div>
          )}

          {/* Performance Metrics Summary - Show on Analytics Tab Only */}
          {activeTab === 'analytics' && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
              <Activity className="h-8 w-8 text-green-400 mx-auto mb-2 animate-pulse" />
              <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {analyticsData?.uptime ? `${analyticsData.uptime}%` : '0%'}
              </div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2 animate-bounce" />
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {analyticsData?.avgResponseTime ? `${analyticsData.avgResponseTime}s` : '0s'}
              </div>
              <div className="text-sm text-gray-400">Avg Response</div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
              <BarChart3 className="h-8 w-8 text-blue-400 mx-auto mb-2 animate-pulse" />
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {analyticsData?.dailyQueries ? analyticsData.dailyQueries.toLocaleString() : '0'}
              </div>
              <div className="text-sm text-gray-400">Daily Queries</div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
              <Brain className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {analyticsData?.accuracy ? `${analyticsData.accuracy}%` : '0%'}
              </div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
          </div>
          )}
        </div>
      </BeamsBackground>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-gray-800 md:hidden">
        <div className="flex justify-around py-2">
          <Link href="/solutions" className="flex flex-col items-center py-2 px-2 text-xs">
            <Microchip className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Research</span>
          </Link>
          <Link href="/services" className="flex flex-col items-center py-2 px-2 text-xs">
            <Wrench className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Services</span>
          </Link>
          <Link href="/news" className="flex flex-col items-center py-2 px-2 text-xs">
            <Newspaper className="h-5 w-5 text-cyan-400 mb-1" />
            <span className="text-cyan-400">News</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center py-2 px-2 text-xs">
            <Shield className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">About</span>
          </Link>
          <Link href="/ai-analytics" className="flex flex-col items-center py-2 px-2 text-xs">
            <BarChart3 className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Analytics</span>
          </Link>
          <Link href="/contact" className="flex flex-col items-center py-2 px-2 text-xs">
            <Phone className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Contact</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}