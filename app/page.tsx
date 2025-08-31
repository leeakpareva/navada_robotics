"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Menu, X, Cog, Microscope as Microchip, Wrench, Shield, Phone, Bot, Cpu, Sparkles } from "lucide-react"
import Link from "next/link"
import { Vortex } from "@/components/ui/vortex"

export default function NavadaRoboticsApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-gray-800 animate-in slide-in-from-top duration-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <Cog className="h-8 w-8 text-purple-400 transition-transform duration-300 group-hover:rotate-45" />
              <h1 className="text-2xl font-bold text-white">NAVADA</h1>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="transition-transform duration-200">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </div>
            </Button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/solutions"
                className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-105 relative group"
              >
                Solutions
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/services"
                className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-105 relative group"
              >
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-105 relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/contact"
                className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-105 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/agent-lee"
                className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-105 relative group"
              >
                Agent Lee
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>
          </div>

          {/* Mobile navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4 animate-in slide-in-from-top duration-300">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/solutions"
                  className="text-white hover:text-purple-400 transition-all duration-200 hover:translate-x-2"
                >
                  Solutions
                </Link>
                <Link
                  href="/services"
                  className="text-white hover:text-purple-400 transition-all duration-200 hover:translate-x-2"
                >
                  Services
                </Link>
                <Link
                  href="/about"
                  className="text-white hover:text-purple-400 transition-all duration-200 hover:translate-x-2"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-white hover:text-purple-400 transition-all duration-200 hover:translate-x-2"
                >
                  Contact
                </Link>
                <Link
                  href="/agent-lee"
                  className="text-white hover:text-purple-400 transition-all duration-200 hover:translate-x-2"
                >
                  Agent Lee
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen">
        <Vortex
          backgroundColor="#000000"
          rangeY={800}
          particleCount={500}
          baseHue={280}
          className="flex items-center justify-center px-4 py-16 min-h-screen"
        >
          <div className="container mx-auto text-center">
            <Badge
            variant="secondary"
            className={`mb-4 bg-purple-900 text-purple-200 border-purple-700 transition-all duration-700 ${
              isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
            }`}
            >
              AI • Robotics • Digital Innovation
            </Badge>
            <h2
              className={`text-4xl md:text-6xl font-bold text-white mb-6 text-balance transition-all duration-1000 delay-200 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0"
              }`}
            >
              <span className="text-purple-400">Navigating Artistic Vision</span> with Advanced Digital Assistance
            </h2>
            <p
              className={`text-xl text-gray-300 mb-8 max-w-3xl mx-auto text-pretty transition-all duration-1000 delay-500 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
              }`}
            >
              NAVADA explores how technology advances our future through the intersection of AI, robotics, and creative
              innovation. I support the growth and adoption of AI tools focused on pioneering research and products in
              robotics and automation for the next generation.
            </p>
            
            {/* Value Props Row */}
            <div
              className={`flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto mb-8 transition-all duration-1000 delay-600 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
              }`}
            >
              <div className="flex items-center justify-center md:flex-col gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-400/10 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-gray-300 font-medium">AI Processing</span>
              </div>
              <div className="flex items-center justify-center md:flex-col gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-400/10 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-gray-300 font-medium">Robotics</span>
              </div>
              <div className="flex items-center justify-center md:flex-col gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-400/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-gray-300 font-medium">Innovation</span>
              </div>
            </div>
            
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
              }`}
            >
              <Link href="/solutions">
                <Button
                  size="lg"
                  className="text-lg px-8 bg-purple-600 hover:bg-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  Explore Innovation
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 bg-transparent border-purple-400 text-purple-400 hover:bg-purple-900 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  My Vision
                </Button>
              </Link>
            </div>
        </div>
        </Vortex>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3
              className={`text-3xl font-bold text-purple-400 mb-4 transition-all duration-700 delay-300 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
              }`}
            >
              Innovation Showcase
            </h3>
            <p
              className={`text-gray-300 max-w-2xl mx-auto transition-all duration-700 delay-500 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
              }`}
            >
              Discover my latest breakthroughs in AI-powered robotics, creative technology, and digital assistance
              platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className={`bg-black rounded-lg overflow-hidden border border-gray-800 transition-all duration-700 delay-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 group ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0"
              }`}
            >
              <img
                src="/placeholder.svg?height=192&width=400&text=AI+Powered+Creative+Robot"
                alt="AI Powered Creative Robot"
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="p-4">
                <h4 className="text-purple-300 font-semibold mb-2 transition-colors duration-200 group-hover:text-purple-200">
                  AI Creative Assistant
                </h4>
                <p className="text-gray-400 text-sm">Artistic vision meets robotic precision</p>
              </div>
            </div>

            <div
              className={`bg-black rounded-lg overflow-hidden border border-gray-800 transition-all duration-700 delay-900 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 group ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0"
              }`}
            >
              <img
                src="/placeholder.svg?height=192&width=400&text=Next+Gen+Automation+Platform"
                alt="Next Generation Automation Platform"
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="p-4">
                <h4 className="text-purple-300 font-semibold mb-2 transition-colors duration-200 group-hover:text-purple-200">
                  Next-Gen Automation
                </h4>
                <p className="text-gray-400 text-sm">Advanced digital assistance for the future</p>
              </div>
            </div>

            <div
              className={`bg-black rounded-lg overflow-hidden border border-gray-800 transition-all duration-700 delay-1000 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 group ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0"
              }`}
            >
              <img
                src="/placeholder.svg?height=192&width=400&text=Educational+AI+Research+Platform"
                alt="Educational AI Research Platform"
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="p-4">
                <h4 className="text-purple-300 font-semibold mb-2 transition-colors duration-200 group-hover:text-purple-200">
                  Research Platform
                </h4>
                <p className="text-gray-400 text-sm">Empowering the next generation of innovators</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4 group">
            <Cog className="h-6 w-6 text-purple-400 transition-transform duration-500 group-hover:rotate-180" />
            <span className="text-xl font-bold text-white">NAVADA</span>
          </div>
          <p className="text-gray-300 mb-2">© 2024 NAVADA. All rights reserved.</p>
          <p className="text-gray-400 text-sm">Navigating Artistic Vision with Advanced Digital Assistance</p>
        </div>
      </footer>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-gray-800 md:hidden animate-in slide-in-from-bottom duration-500">
        <div className="flex justify-around py-2">
          <Link
            href="/solutions"
            className="flex flex-col items-center py-2 px-2 text-xs transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <Microchip className="h-5 w-5 text-gray-400 mb-1 transition-colors duration-200 hover:text-purple-400" />
            <span className="text-gray-400 transition-colors duration-200 hover:text-purple-400">Research</span>
          </Link>
          <Link
            href="/services"
            className="flex flex-col items-center py-2 px-2 text-xs transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <Wrench className="h-5 w-5 text-gray-400 mb-1 transition-colors duration-200 hover:text-purple-400" />
            <span className="text-gray-400 transition-colors duration-200 hover:text-purple-400">Services</span>
          </Link>
          <Link
            href="/agent-lee"
            className="flex flex-col items-center py-2 px-2 text-xs transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <Bot className="h-5 w-5 text-gray-400 mb-1 transition-colors duration-200 hover:text-purple-400" />
            <span className="text-gray-400 transition-colors duration-200 hover:text-purple-400">Agent Lee</span>
          </Link>
          <Link
            href="/about"
            className="flex flex-col items-center py-2 px-2 text-xs transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <Shield className="h-5 w-5 text-gray-400 mb-1 transition-colors duration-200 hover:text-purple-400" />
            <span className="text-gray-400 transition-colors duration-200 hover:text-purple-400">About</span>
          </Link>
          <Link
            href="/contact"
            className="flex flex-col items-center py-2 px-2 text-xs transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <Phone className="h-5 w-5 text-gray-400 mb-1 transition-colors duration-200 hover:text-purple-400" />
            <span className="text-gray-400 transition-colors duration-200 hover:text-purple-400">Contact</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
