"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

interface EmailSignupProps {
  source?: string
  placeholder?: string
  buttonText?: string
  className?: string
  variant?: 'default' | 'minimal' | 'purple'
}

export function EmailSignup({
  source = 'website',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe',
  className = '',
  variant = 'default'
}: EmailSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter an email address')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/emails/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Successfully subscribed!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          container: 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg',
          input: 'bg-transparent border-white/20 text-white placeholder-gray-400',
          button: 'bg-white text-black hover:bg-gray-100'
        }
      case 'purple':
        return {
          container: 'bg-purple-600/10 backdrop-blur-sm border border-purple-400/30 rounded-lg',
          input: 'bg-black/30 border-purple-400/50 text-white placeholder-gray-400 focus:border-purple-400',
          button: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
        }
      default:
        return {
          container: 'bg-gray-50 border border-gray-200 rounded-lg',
          input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
          button: 'bg-blue-600 hover:bg-blue-700 text-white'
        }
    }
  }

  const styles = getVariantStyles()

  if (status === 'success') {
    return (
      <div className={`p-6 ${styles.container} ${className}`}>
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-2 bg-green-500/20 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-green-400 mb-1">
              Successfully Added!
            </h4>
            <p className="text-sm text-gray-300">
              You've been added to our mailing list and will be kept updated on our latest developments.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 ${styles.container} ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className={`pl-10 ${styles.input}`}
              disabled={status === 'loading'}
            />
          </div>
          <Button
            type="submit"
            disabled={status === 'loading' || !email.trim()}
            className={styles.button}
          >
            {status === 'loading' ? 'Subscribing...' : buttonText}
          </Button>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{message}</span>
          </div>
        )}
      </form>
    </div>
  )
}