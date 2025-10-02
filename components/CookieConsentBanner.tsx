'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { clientCookies } from '@/lib/cookies'
import { X, Cookie } from 'lucide-react'

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const consent = clientCookies.getCookieConsent()

    if (!consent) {
      // Show banner after a brief delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true)
        setIsVisible(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    clientCookies.setCookieConsent(true)
    hideBanner()
  }

  const handleDeny = () => {
    clientCookies.setCookieConsent(false)
    // Clear any existing survey cookies
    clientCookies.clearSurveyData()
    hideBanner()
  }

  const hideBanner = () => {
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  // Don't render anything until we know we need to show the banner
  if (!showBanner) {
    return null
  }

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 max-w-sm transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <Card className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 shadow-xl">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Cookie className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">Cookie Consent</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={hideBanner}
              className="text-gray-400 hover:text-white p-1 h-6 w-6"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            We use cookies for surveys, analytics, and to improve your experience.
          </p>

          <div className="flex gap-2">
            <Button
              onClick={handleAccept}
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Accept
            </Button>
            <Button
              onClick={handleDeny}
              variant="outline"
              size="sm"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Deny
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}