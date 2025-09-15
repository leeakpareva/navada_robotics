'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BeamsBackground } from '@/components/ui/beams-background'
import {
  BrainCircuit,
  MessageSquare,
  Activity,
  TrendingUp,
  Settings,
  LogOut,
  Sparkles,
  BarChart3,
  User,
  Clock,
  Menu,
  X,
  Home,
  BookOpen,
  Phone,
  Wrench,
  Shield,
  Crown,
  Zap,
  Globe
} from 'lucide-react'
import Link from 'next/link'

interface ChatSession {
  id: string
  threadId: string
  messageCount: number
  lastActivity: string
  status: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchChatSessions()
    }
  }, [session])

  const fetchChatSessions = async () => {
    try {
      const response = await fetch('/api/user/chat-sessions')
      if (response.ok) {
        const sessions = await response.json()
        setChatSessions(sessions)
      }
    } catch (error) {
      console.error('Failed to fetch chat sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!session) {
    return null
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
              <Link href="/analytics" className="text-white hover:text-purple-400 transition-colors">
                Analytics
              </Link>
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
                Agent Lee
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                Contact
              </Link>

              {/* User Welcome & Session Management */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
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
                <Link href="/analytics" className="text-white hover:text-purple-400 transition-colors">
                  Analytics
                </Link>
                <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
                  Agent Lee
                </Link>
                <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                  Contact
                </Link>

                {/* Mobile User Info */}
                <div className="pt-3 border-t border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
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

      {/* Dashboard Content */}
      <BeamsBackground intensity="subtle" className="py-16 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Dashboard
            </h1>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Welcome back, {session?.user?.name || 'User'}! Manage your AI interactions and explore NAVADA Robotics.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-300" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Total Chats</CardTitle>
                    <CardDescription className="text-gray-300">Conversations with Agent Lee</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {chatSessions.length}
                </div>
                <p className="text-gray-400 text-sm">
                  {chatSessions.filter(s => s.status === 'active').length} active sessions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-white/20 hover:border-cyan-400/50 backdrop-blur-sm transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Activity className="h-6 w-6 text-cyan-300" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Total Messages</CardTitle>
                    <CardDescription className="text-gray-300">Messages exchanged</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {chatSessions.reduce((total, session) => total + session.messageCount, 0)}
                </div>
                <p className="text-gray-400 text-sm">
                  Across all conversations
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-white/20 hover:border-pink-400/50 backdrop-blur-sm transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Crown className="h-6 w-6 text-pink-300" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Account Type</CardTitle>
                    <CardDescription className="text-gray-300">Current subscription</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  Free
                </div>
                <p className="text-gray-400 text-sm">
                  Upgrade for more features
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm transition-all duration-300 mb-12">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-300" />
                </div>
                <div>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-300">Jump to your favorite features</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/agent-lee">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 transform hover:scale-105">
                  Chat with Agent Lee
                </Button>
              </Link>
              <Link href="/analytics">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 transform hover:scale-105">
                  View Analytics
                </Button>
              </Link>
              <Link href="/learning">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 transform hover:scale-105">
                  Learning Hub
                </Button>
              </Link>
              <Link href="/solutions">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 transform hover:scale-105">
                  Explore Solutions
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="chats" className="space-y-6">
            <TabsList className="bg-black/40 border border-white/20">
              <TabsTrigger value="chats" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat History
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chats" className="space-y-4">
              <Card className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-purple-300" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Chat History</CardTitle>
                      <CardDescription className="text-gray-300">Your recent conversations with Agent Lee</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                      <span className="ml-2 text-gray-300">Loading chat history...</span>
                    </div>
                  ) : chatSessions.length > 0 ? (
                    <div className="space-y-4">
                      {chatSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-lg hover:border-purple-400/50 transition-all duration-300">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                              <MessageSquare className="h-4 w-4 text-purple-300" />
                            </div>
                            <div>
                              <p className="font-medium text-white">Chat #{session.threadId.slice(-8)}</p>
                              <p className="text-sm text-gray-400">
                                {session.messageCount} messages • Last active: {new Date(session.lastActivity).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 text-xs rounded-full ${
                              session.status === 'active'
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                            }`}>
                              {session.status}
                            </span>
                            <Link href={`/agent-lee?threadId=${session.threadId}`}>
                              <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white hover:bg-purple-600/20">
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mb-4">
                        <p className="text-gray-300 text-lg">No chat history yet</p>
                        <p className="text-gray-500 text-sm">Start your first conversation with Agent Lee!</p>
                      </div>
                      <Link href="/agent-lee">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                          Start Chat
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <Card className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <User className="h-6 w-6 text-purple-300" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Profile Settings</CardTitle>
                      <CardDescription className="text-gray-300">Manage your account information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{session?.user?.name || 'User'}</h3>
                      <p className="text-gray-400">{session?.user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                      <label className="text-sm font-medium text-purple-300">Name</label>
                      <p className="text-white mt-1">{session?.user?.name || 'Not set'}</p>
                    </div>
                    <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                      <label className="text-sm font-medium text-purple-300">Email</label>
                      <p className="text-white mt-1">{session?.user?.email}</p>
                    </div>
                    <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                      <label className="text-sm font-medium text-purple-300">Account Type</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Crown className="h-4 w-4 text-yellow-400" />
                        <span className="text-white">Free Tier</span>
                      </div>
                    </div>
                    <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                      <label className="text-sm font-medium text-purple-300">Member Since</label>
                      <p className="text-white mt-1">Recently joined</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="outline" className="border-purple-400/50 text-purple-300 hover:bg-purple-600/20 hover:border-purple-400 hover:text-white">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="border-green-400/50 text-green-300 hover:bg-green-600/20 hover:border-green-400 hover:text-white">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </BeamsBackground>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-gray-800 md:hidden">
        <div className="flex justify-around py-2">
          <Link href="/solutions" className="flex flex-col items-center py-2 px-3 text-xs">
            <Wrench className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Solutions</span>
          </Link>
          <Link href="/services" className="flex flex-col items-center py-2 px-3 text-xs">
            <Shield className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Services</span>
          </Link>
          <Link href="/agent-lee" className="flex flex-col items-center py-2 px-3 text-xs">
            <span className="text-gray-400">Agent Lee</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center py-2 px-3 text-xs">
            <User className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Dashboard</span>
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