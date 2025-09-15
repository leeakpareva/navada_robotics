"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BeamsBackground } from "@/components/ui/beams-background"
import { EmailSignup } from "@/components/ui/email-signup"
import { LearningInterestForm } from "@/components/ui/learning-interest-form"
import { createLearningInterest } from "@/lib/actions/learning-interest"
import {
  Menu,
  X,
  BookOpen,
  Clock,
  Microscope as Microchip,
  Wrench,
  Shield,
  Phone,
  Brain,
  BarChart3,
  Mail,
  Sparkles,
  Users,
  Zap
} from "lucide-react"
import Link from "next/link"

export default function LearningPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              <Link href="/services" className="text-white hover:text-purple-400 transition-colors">
                Services
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                About
              </Link>
              <Link href="/learning" className="text-purple-400 font-medium">
                Learning
              </Link>
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
                Agent Lee
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
                <Link href="/services" className="text-white hover:text-purple-400 transition-colors">
                  Services
                </Link>
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                  About
                </Link>
                <Link href="/learning" className="text-purple-400 font-medium">
                  Learning
                </Link>
                <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
                  Agent Lee
                </Link>
                <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Learning Section */}
      <BeamsBackground intensity="subtle" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Learning Hub</h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Interactive courses and tutorials for robotics, AI, and digital innovation
            </p>
          </div>

          {/* Coming Soon Content */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 md:p-12 border border-purple-400/50 hover:bg-black/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Clock className="h-12 w-12 text-purple-400 animate-spin" style={{animationDuration: '3s'}} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">Coming Soon</h3>

            <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              We're building a comprehensive learning platform with interactive courses,
              hands-on tutorials, and certification programs in robotics and AI development.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-400/30 hover:border-purple-400/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                <Brain className="h-10 w-10 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="text-white font-semibold mb-2 group-hover:text-purple-200 transition-colors">AI Fundamentals</h4>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Machine learning basics to advanced neural networks</p>
              </div>

              <div className="group bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-6 border border-cyan-400/30 hover:border-cyan-400/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20">
                <Microchip className="h-10 w-10 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="text-white font-semibold mb-2 group-hover:text-cyan-200 transition-colors">Robotics Engineering</h4>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Hands-on robot building and programming</p>
              </div>

              <div className="group bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg p-6 border border-pink-400/30 hover:border-pink-400/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20">
                <BarChart3 className="h-10 w-10 text-pink-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="text-white font-semibold mb-2 group-hover:text-pink-200 transition-colors">Data Science</h4>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Analytics and visualization for robotics</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-purple-300 font-medium">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span>Expected Launch: Q4 2025</span>
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
          </div>

          {/* Learning Interest Form */}
          <div className="mb-12">
            <LearningInterestForm onSubmit={createLearningInterest} />
          </div>

          {/* Newsletter Signup Section */}
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full">
                  <Mail className="h-8 w-8 text-purple-300" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Subscribe to NAVADA Newsletters</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Stay updated with the latest in robotics research, AI breakthroughs, and be the first to access our Learning Hub when it launches</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-3 bg-black/30 rounded-lg p-4 border border-purple-400/20">
                <Zap className="h-6 w-6 text-purple-400 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium text-sm">Latest Research</h5>
                  <p className="text-gray-400 text-xs">Cutting-edge discoveries</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-black/30 rounded-lg p-4 border border-cyan-400/20">
                <Users className="h-6 w-6 text-cyan-400 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium text-sm">Community Updates</h5>
                  <p className="text-gray-400 text-xs">Connect with innovators</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-black/30 rounded-lg p-4 border border-pink-400/20">
                <BookOpen className="h-6 w-6 text-pink-400 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium text-sm">Early Access</h5>
                  <p className="text-gray-400 text-xs">First to learn & explore</p>
                </div>
              </div>
            </div>

            <div className="max-w-lg mx-auto">
              <EmailSignup
                variant="purple"
                source="learning-page"
                placeholder="Enter your email for newsletters"
                buttonText="Subscribe Now"
                className="bg-black/30 backdrop-blur-sm border-white/20 hover:border-purple-400/50 transition-all duration-300"
              />
              <p className="text-xs text-gray-500 text-center mt-3">Join 1,000+ innovators. Unsubscribe anytime.</p>
            </div>
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
          <Link href="/services" className="flex flex-col items-center py-2 px-3 text-xs">
            <Wrench className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Services</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center py-2 px-3 text-xs">
            <Shield className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">About</span>
          </Link>
          <Link href="/learning" className="flex flex-col items-center py-2 px-3 text-xs">
            <BookOpen className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Learning</span>
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