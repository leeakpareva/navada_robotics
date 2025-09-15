"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BeamsBackground } from "@/components/ui/beams-background"
import {
  Menu,
  X,
  Server,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Settings,
  BarChart3,
  RefreshCw,
  Play,
  Square,
  Eye,
} from "lucide-react"
import Link from "next/link"

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

export default function MCPDashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [servers, setServers] = useState<MCPServerStatus[]>([])
  const [stats, setStats] = useState<MCPStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch MCP servers and stats
  useEffect(() => {
    fetchMCPData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchMCPData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMCPData = async () => {
    try {
      setLoading(true)

      // Fetch servers
      const serversResponse = await fetch('/api/mcp/servers')
      if (serversResponse.ok) {
        const serversData = await serversResponse.json()
        setServers(serversData.servers || [])
      }

      // Fetch stats
      const statsResponse = await fetch('/api/mcp/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch MCP data')
      console.error('MCP Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleServerToggle = async (serverId: string, currentStatus: string) => {
    try {
      const action = currentStatus === 'active' ? 'disconnect' : 'connect'
      const response = await fetch(`/api/mcp/servers/${serverId}/${action}`, {
        method: 'POST'
      })

      if (response.ok) {
        // Refresh data after successful toggle
        fetchMCPData()
      } else {
        const errorData = await response.json()
        setError(errorData.error || `Failed to ${action} server`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to toggle server ${serverId}`)
    }
  }

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
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
                Agent Lee
              </Link>
              <Link href="/mcp-dashboard" className="text-purple-400 font-medium">
                MCP Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* MCP Dashboard */}
      <BeamsBackground intensity="subtle" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              MCP Server Dashboard
            </h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Monitor and manage Model Context Protocol servers for Agent Lee
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                onClick={fetchMCPData}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-400/50 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                <Server className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalServers}</div>
                <div className="text-sm text-gray-400">Total Servers</div>
              </div>

              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                <Activity className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{stats.activeServers}</div>
                <div className="text-sm text-gray-400">Active Servers</div>
              </div>

              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                <BarChart3 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">{stats.totalCalls}</div>
                <div className="text-sm text-gray-400">Total Calls</div>
              </div>

              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-400">{stats.successRate}%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>

              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">{stats.avgResponseTime}ms</div>
                <div className="text-sm text-gray-400">Avg Response</div>
              </div>
            </div>
          )}

          {/* Server List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {servers.map((server) => (
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
                        onClick={() => handleServerToggle(server.id, server.status)}
                        disabled={server.status === 'connecting'}
                        className="text-white hover:bg-gray-700"
                      >
                        {server.status === 'active' ? (
                          <Square className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
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
                    {/* Server Info */}
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

                    {/* Tools */}
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

                    {/* Status Badge */}
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

          {servers.length === 0 && !loading && (
            <div className="text-center py-12">
              <Server className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No MCP Servers Found</h3>
              <p className="text-gray-400">MCP servers will appear here once configured.</p>
            </div>
          )}
        </div>
      </BeamsBackground>
    </div>
  )
}