'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BeamsBackground } from '@/components/ui/beams-background'
import { UserPlus, Eye, EyeOff, Home, LogIn, Loader2 } from 'lucide-react'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Trim whitespace from passwords before comparing
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: trimmedPassword,
        }),
      })

      if (response.ok) {
        // Auto sign in after registration
        const result = await signIn('credentials', {
          email: email.trim(),
          password: trimmedPassword,
          redirect: false,
        })

        if (result?.ok) {
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        const data = await response.json()
        setError(data.error || 'Something went wrong')
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
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Create Account
              </h2>
              <p className="text-white/70 text-sm">Join NAVADA Robotics today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-black/30 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 transition-all duration-300"
                  required
                />
              </div>

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
                    placeholder="Create a password"
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

              <div>
                <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="bg-black/30 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 transition-all duration-300 pr-10 text-sm py-1.5"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Create Account
                </Button>

                <div className="flex flex-col space-y-2">
                  <Link href="/auth/signin">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-purple-400/50 text-purple-300 hover:bg-purple-600/20 hover:border-purple-400 hover:text-white transition-all duration-300"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Already have an account? Sign in
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