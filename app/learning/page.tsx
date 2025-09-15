"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BeamsBackground } from "@/components/ui/beams-background"
import { EmailSignup } from "@/components/ui/email-signup"
import { Menu, X, BookOpen, Clock, Microscope as Microchip, Wrench, Shield, Phone, Brain, BarChart3 } from "lucide-react"
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
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-purple-500/20 rounded-full">
                  <BookOpen className="h-16 w-16 text-purple-300" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Learning Hub</h2>
              <p className="text-lg text-gray-100 mb-8">
                Interactive courses and tutorials for robotics, AI, and digital innovation
              </p>
            </div>

            {/* Coming Soon Content */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-12 border border-purple-400/50 hover:bg-black/40 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <Clock className="h-12 w-12 text-purple-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Coming Soon</h3>
              
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                We're building an comprehensive learning platform with interactive courses, 
                hands-on tutorials, and certification programs in robotics and AI development.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-400/30">
                  <Brain className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold mb-2">AI Fundamentals</h4>
                  <p className="text-gray-400 text-sm">Machine learning basics to advanced neural networks</p>
                </div>
                
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-400/30">
                  <Microchip className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold mb-2">Robotics Engineering</h4>
                  <p className="text-gray-400 text-sm">Hands-on robot building and programming</p>
                </div>
                
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-400/30">
                  <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold mb-2">Data Science</h4>
                  <p className="text-gray-400 text-sm">Analytics and visualization for robotics</p>
                </div>
              </div>

              <div className="text-purple-300 font-medium">
                Expected Launch: Q4 2025
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8">
              <h4 className="text-xl font-semibold text-white mb-4">Get Notified</h4>
              <p className="text-gray-300 mb-6">Be the first to know when our Learning Hub launches</p>
              <div className="max-w-md mx-auto">
                <EmailSignup
                  variant="purple"
                  source="learning-page"
                  placeholder="Enter your email for updates"
                  buttonText="Notify Me"
                  className="bg-black/30 backdrop-blur-sm border-white/20"
                />
              </div>
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