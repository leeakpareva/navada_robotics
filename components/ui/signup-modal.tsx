"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  courseTitle?: string
  onSuccess?: () => void
}

export function SignupModal({ isOpen, onClose, courseTitle, onSuccess }: SignupModalProps) {
  const [isSignup, setIsSignup] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSignup) {
        // Sign up flow
        if (password !== confirmPassword) {
          toast.error("Passwords do not match")
          setIsLoading(false)
          return
        }

        if (password.length < 6) {
          toast.error("Password must be at least 6 characters")
          setIsLoading(false)
          return
        }

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
          }),
        })

        if (response.ok) {
          // Auto sign in after registration
          const result = await signIn("credentials", {
            email: email.trim(),
            password: password.trim(),
            redirect: false,
          })

          if (result?.ok) {
            toast.success("Account created successfully!")
            onClose()
            if (onSuccess) {
              onSuccess()
            }
          }
        } else {
          const data = await response.json()
          toast.error(data.error || "Failed to create account")
        }
      } else {
        // Sign in flow
        const result = await signIn("credentials", {
          email: email.trim(),
          password: password.trim(),
          redirect: false,
        })

        if (result?.ok) {
          toast.success("Signed in successfully!")
          onClose()
          if (onSuccess) {
            onSuccess()
          }
        } else {
          toast.error("Invalid email or password")
        }
      }
    } catch (error) {
      console.error("Auth error:", error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setShowPassword(false)
    setIsLoading(false)
  }

  const switchMode = () => {
    setIsSignup(!isSignup)
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-black/95 via-purple-900/20 to-black/95 backdrop-blur-sm border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl text-center">
            {isSignup ? "Create Account" : "Sign In"}
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-center">
            {courseTitle
              ? `${isSignup ? "Create an account" : "Sign in"} to start learning "${courseTitle}"`
              : `${isSignup ? "Join NAVADA Robotics" : "Welcome back"}`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-black/30 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-black/30 border-white/20 text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-black/30 border-white/20 text-white placeholder-gray-400 pr-10"
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

          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="bg-black/30 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>
          )}

          <div className="space-y-3 pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isSignup ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isSignup ? "Create Account" : "Sign In"}
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={switchMode}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                {isSignup
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}