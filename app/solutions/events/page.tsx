"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BeamsBackground } from "@/components/ui/beams-background"
import { Menu, X, Microscope as Microchip, Shield, Phone, Calendar, MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"
import { OptimizedImage } from "@/components/ui/optimized-image"

export default function EventsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    interests: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

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
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          eventId: 'ai-unlocked-2024',
          eventName: 'AI UNLOCKED: Learn & Network Day',
          source: 'events_page'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormStatus('success')
        setStatusMessage(data.message || 'Registration successful! You will receive a confirmation email shortly.')
        setFormData({ name: '', email: '', phone: '', company: '', jobTitle: '', interests: '' })
      } else {
        setFormStatus('error')
        setStatusMessage(data.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      setFormStatus('error')
      setStatusMessage('An error occurred. Please try again later.')
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
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
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              AI UNLOCKED
            </h2>
            <p className="text-xl md:text-2xl text-purple-300 mb-6">Learn & Network Day</p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-300 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                <span>01/12/2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                <span>09:30 - 18:00</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-400" />
                <span>The XCHG, 22 Bishopsgate, London</span>
              </div>
            </div>
          </div>

          {/* Event Image */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative rounded-2xl overflow-hidden">
              <OptimizedImage
                src="/Event 2.png"
                alt="AI UNLOCKED: Learn & Network Day"
                width={800}
                height={450}
                quality={95}
                priority
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <BeamsBackground intensity="subtle" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Event Description */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white mb-6">Event Overview</h3>
                <div className="prose prose-invert prose-purple max-w-none">
                  <p className="text-gray-200 text-lg leading-relaxed mb-6">
                    AI UNLOCKED is a hands-on learn, build and network day hosted by NAVADA and caffeine at The XCHG, 22 Bishopsgate, London.
                  </p>
                  <p className="text-gray-200 text-lg leading-relaxed mb-6">
                    <strong>The goal is simple:</strong> take AI out of the hype cycle and put it in people's hands.
                  </p>
                  <p className="text-gray-200 leading-relaxed mb-8">
                    Across the day, founders, engineers, creatives and operators will:
                  </p>
                  <ul className="text-gray-200 space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Learn the fundamentals of modern AI – from "AI from scratch" live builds to real product demos.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Explore the risks, governance and ethics of deploying AI in real organisations.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Look at new opportunity spaces — especially AI and robotics in Africa and the wider enterprise ecosystem.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Build and ship in real time through a 4-hour hackathon, guided by mentors.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Get feedback from experienced founders and investors including Fuel Ventures and operators such as Leslie, Keash, Daniel, JB and Tola Adaleyde.</span>
                    </li>
                  </ul>
                  <p className="text-purple-200 text-lg font-medium">
                    Attendees leave with working prototypes, a clearer view of AI's future viability, and a much stronger network of collaborators, mentors and potential investors.
                  </p>
                </div>
              </div>

              {/* Registration Form */}
              <div className="lg:sticky lg:top-8">
                <Card className="bg-black/40 border-purple-400 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">Register Now</h3>

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

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-white font-medium mb-2">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                          placeholder="Your full name"
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
                        <label htmlFor="company" className="block text-white font-medium mb-2">
                          Company/Organization
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                          placeholder="Your company"
                        />
                      </div>

                      <div>
                        <label htmlFor="jobTitle" className="block text-white font-medium mb-2">
                          Job Title/Role
                        </label>
                        <input
                          type="text"
                          id="jobTitle"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                          placeholder="Your role"
                        />
                      </div>

                      <div>
                        <label htmlFor="interests" className="block text-white font-medium mb-2">
                          What interests you most about this event?
                        </label>
                        <textarea
                          id="interests"
                          name="interests"
                          value={formData.interests}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                          placeholder="Tell us what you're hoping to learn or achieve..."
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={formStatus === 'submitting'}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 mt-6"
                      >
                        {formStatus === 'submitting' ? 'Registering...' : 'Register for Event'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </BeamsBackground>

      {/* Detailed Agenda Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Event Agenda</h3>

            <div className="space-y-8">
              {/* Time slots */}
              <div className="border-l-2 border-purple-500/30 pl-6 space-y-8">

                <div className="relative">
                  <div className="absolute -left-9 w-4 h-4 bg-purple-500 rounded-full border-4 border-black"></div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h4 className="text-xl font-semibold text-white">Opening Keynote – "AI Unlocked"</h4>
                      <span className="text-purple-300 font-medium">10:00 – 10:45</span>
                    </div>
                    <p className="text-gray-300">30-min keynote on the state of AI & where it's really going + 15-min interactive Q&A with Leslie.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-9 w-4 h-4 bg-purple-500 rounded-full border-4 border-black"></div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h4 className="text-xl font-semibold text-white">AI From Scratch: Live Build + Hackathon</h4>
                      <span className="text-purple-300 font-medium">11:45 – 13:00</span>
                    </div>
                    <p className="text-gray-300">Guided "AI from scratch" demo showing end-to-end build. Teams start implementing their own solutions in parallel.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-9 w-4 h-4 bg-purple-500 rounded-full border-4 border-black"></div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h4 className="text-xl font-semibold text-white">Risks & Governance: The AI Ecosystem</h4>
                      <span className="text-purple-300 font-medium">13:45 – 14:30</span>
                    </div>
                    <p className="text-gray-300">Practical view on regulation, compliance and responsible deployment. Frameworks legal, risk and product teams can actually use.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-9 w-4 h-4 bg-purple-500 rounded-full border-4 border-black"></div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h4 className="text-xl font-semibold text-white">Opportunity in AFRICA</h4>
                      <span className="text-purple-300 font-medium">14:30 – 15:00</span>
                    </div>
                    <p className="text-gray-300">Why Africa is a key frontier market for AI. Case studies and market opportunities presented by Prince Kamari.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-9 w-4 h-4 bg-purple-500 rounded-full border-4 border-black"></div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h4 className="text-xl font-semibold text-white">AI, Robotics & Enterprise Panel</h4>
                      <span className="text-purple-300 font-medium">15:00 – 15:45</span>
                    </div>
                    <p className="text-gray-300">15-min keynote + 30-min panel on scaling AI & robotics inside real businesses. Speakers: Leslie, Keash, Daniel, JB, Fuel Ventures.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-9 w-4 h-4 bg-purple-500 rounded-full border-4 border-black"></div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h4 className="text-xl font-semibold text-white">Hackathon Demos & Winners</h4>
                      <span className="text-purple-300 font-medium">16:40 – 17:30</span>
                    </div>
                    <p className="text-gray-300">Teams give short demos to judges. Feedback from Leslie, Keash, Daniel, JB & Fuel Ventures + winner announcements.</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-300 mb-4">
                <strong className="text-white">Judges:</strong> Leslie, Keash, Daniel, JB, Fuel Ventures
              </p>
              <p className="text-purple-300 text-lg font-medium">
                Join us for an intensive day of learning, building, and networking in the heart of London's financial district.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-gray-800 md:hidden">
        <div className="flex justify-around py-2">
          <Link href="/solutions" className="flex flex-col items-center py-2 px-3 text-xs">
            <Microchip className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Solutions</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center py-2 px-3 text-xs">
            <Shield className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">About</span>
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