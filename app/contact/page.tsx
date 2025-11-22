"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BeamsBackground } from "@/components/ui/beams-background"
import { Menu, X, Phone, Microscope as Microchip, Shield } from "lucide-react"
import Link from "next/link"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { isLearningHubEnabled } from "@/lib/feature-flags"

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [subscribeMessage, setSubscribeMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    setStatusMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setFormStatus('success')
        setStatusMessage(data.message || 'Thank you for your message! We will get back to you soon.')
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        setFormStatus('error')
        setStatusMessage(data.error || 'Failed to submit form. Please try again.')
      }
    } catch (error) {
      setFormStatus('error')
      setStatusMessage('An error occurred. Please try again later.')
    }
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribeStatus('submitting')
    setSubscribeMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: subscribeEmail, source: 'contact_page' }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscribeStatus('success')
        setSubscribeMessage(data.message || 'Thank you for subscribing! Stay tuned for updates.')
        setSubscribeEmail('')
      } else {
        setSubscribeStatus('error')
        setSubscribeMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setSubscribeStatus('error')
      setSubscribeMessage('An error occurred. Please try again later.')
    }
  }


  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <OptimizedImage
                src="/logo.PNG"
                alt="NAVADA"
                width={120}
                height={40}
                className="h-8 w-auto filter brightness-0 invert"
              />
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
{isLearningHubEnabled() && (
                <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                  Learning
                </Link>
              )}
              <Link href="/contact" className="text-purple-400 font-medium">
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
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                  About
                </Link>
                {isLearningHubEnabled() && (
                  <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                    Learning
                  </Link>
                )}
                <Link href="/contact" className="text-purple-400 font-medium">
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Contact Section */}
      <BeamsBackground
        intensity="subtle"
        className="py-16 px-4"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
          </div>

          {/* Centered Spline Animation */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-4 border border-white/10">
              <div className="w-full h-[400px] md:h-[500px] bg-black rounded-2xl overflow-hidden">
                <iframe
                  src='https://my.spline.design/earthdayandnight-KuBVP7NaATc9ZisVhiFy0zym/'
                  frameBorder='0'
                  width='100%'
                  height='100%'
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="bg-black/30 border-white/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Send Me a Message</h3>

                {formStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <p className="text-green-200 text-center">{statusMessage}</p>
                  </div>
                )}

                {formStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-200 text-center">{statusMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-medium mb-2">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white font-medium mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-white font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="+44 1234 567890"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-white font-medium mb-2">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                      placeholder="Tell me about your project or inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6"
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Email Subscribe Section */}
          <div className="mt-16 max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-600/40 to-purple-800/40 border-purple-400 backdrop-blur-sm shadow-xl shadow-purple-500/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Stay Updated</h3>
                <p className="text-gray-100 mb-6 font-medium">
                  Subscribe to our newsletter for the latest updates on AI, robotics, and technology innovations
                </p>

                {subscribeStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <p className="text-green-200">{subscribeMessage}</p>
                  </div>
                )}

                {subscribeStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-200">{subscribeMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={subscribeStatus === 'submitting'}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  >
                    {subscribeStatus === 'submitting' ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </BeamsBackground>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-gray-800 md:hidden">
        <div className="flex justify-around py-2">
          <Link href="/solutions" className="flex flex-col items-center py-2 px-3 text-xs">
            <Microchip className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Research</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center py-2 px-3 text-xs">
            <Shield className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">About</span>
          </Link>
          <Link href="/contact" className="flex flex-col items-center py-2 px-3 text-xs">
            <Phone className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Contact</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
