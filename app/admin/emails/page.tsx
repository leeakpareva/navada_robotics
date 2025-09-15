"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Mail, TrendingUp, Shield } from 'lucide-react'

interface EmailSubscriber {
  id: number
  email: string
  source: string | null
  subscribedAt: string
  isActive: boolean
}

interface EmailStats {
  total: number
  active: number
  inactive: number
}

export default function EmailAdminPage() {
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([])
  const [stats, setStats] = useState<EmailStats | null>(null)
  const [adminKey, setAdminKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchEmails = async () => {
    if (!adminKey.trim()) {
      setError('Admin key is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/emails/admin', {
        headers: {
          'Authorization': `Bearer ${adminKey}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubscribers(data.subscribers)
        setStats(data.statistics)
        setIsAuthenticated(true)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Authentication failed')
        setIsAuthenticated(false)
      }
    } catch (err) {
      setError('Network error occurred')
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchEmails()
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto bg-gray-900 border-gray-700">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <CardTitle className="text-white">Email Admin Access</CardTitle>
            <CardDescription className="text-gray-400">
              Enter admin key to view email subscribers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter admin key"
              className="bg-gray-800 border-gray-600 text-white"
            />
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <Button
              onClick={fetchEmails}
              disabled={loading || !adminKey.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Admin key is set in environment variables (EMAIL_ADMIN_KEY)
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Email Subscribers</h1>
          <p className="text-gray-400">Manage and view email subscriptions</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Active Subscribers</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.active}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Inactive Subscribers</CardTitle>
                <Mail className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{stats.inactive}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscribers Table */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">All Subscribers</CardTitle>
            <CardDescription className="text-gray-400">
              List of all email subscribers and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-400 font-medium">Email</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Source</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Subscribed</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-b border-gray-800">
                      <td className="py-3 text-white">{subscriber.email}</td>
                      <td className="py-3 text-gray-400">{subscriber.source || 'unknown'}</td>
                      <td className="py-3 text-gray-400">{formatDate(subscriber.subscribedAt)}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscriber.isActive
                              ? 'bg-green-900 text-green-300'
                              : 'bg-red-900 text-red-300'
                          }`}
                        >
                          {subscriber.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {subscribers.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No subscribers found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
            className="border-gray-600 text-gray-400 hover:bg-gray-800"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}