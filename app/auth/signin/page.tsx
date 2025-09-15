'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BeamsBackground } from '@/components/ui/beams-background'
import { Lock, Unlock, Eye, EyeOff, Home, UserPlus, Loader2 } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
      } else {
        // Check if user is admin and redirect accordingly
        if (email === 'leeakpareva@gmail.com') {
          router.push('/admin/courses')
        } else {
          router.push('/learning')
        }
        router.refresh()
      }
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }


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
                Welcome Back
              </h2>
              <p className="text-white/70 text-sm">Sign in to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-black/30 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-black/30 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 transition-all duration-300 pr-10 text-sm py-1.5"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-400/50 rounded-lg p-2">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Unlock className="h-4 w-4 mr-2" />
                  )}
                  Sign In
                </Button>

                <div className="flex flex-col space-y-2 pt-2">
                  <Link href="/auth/signup">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-purple-400/50 text-purple-300 hover:bg-purple-600/20 hover:border-purple-400 hover:text-white transition-all duration-300"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Don't have an account? Sign up
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}