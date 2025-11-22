"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProjectVideo } from "@/components/ui/project-video"

export default function ProjectsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

      {/* Projects Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Projects
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore cutting-edge robotics and AI projects from research labs and innovation centers.
            </p>
          </div>

          {/* Cyberdeck Project */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Video Side */}
              <div className="order-first lg:order-first">
                <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-4 border border-white/10">
                  <ProjectVideo
                    src="/videos/purple-pie.mp4"
                    title="Purple Pie - Raspberry Pi Powered AI Device"
                    className="w-full bg-black overflow-hidden"
                  />
                </div>
              </div>

              {/* Content Side */}
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-white">Purple Pie</h3>
                <p className="text-purple-300 text-lg font-medium">Raspberry Pi Powered AI Device</p>

                <p className="text-lg text-gray-200 leading-relaxed">
                  A cutting-edge cyberdeck concept powered by Raspberry Pi, designed to bring AI capabilities directly into your hands.
                  This innovative device combines retro-futuristic aesthetics with modern AI processing power, creating a unique
                  portable computing experience.
                </p>

                <div className="space-y-4">
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30">
                    <h4 className="text-white font-semibold mb-2">Key Features</h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Raspberry Pi-powered AI processing</li>
                      <li>• Portable cyberpunk-inspired design</li>
                      <li>• Integrated AI assistance capabilities</li>
                      <li>• Custom software interface</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/40 backdrop-blur-sm rounded-lg p-4 border border-purple-400/50">
                    <p className="text-purple-200 font-medium">Production Timeline: Summer 2026</p>
                    <p className="text-gray-300 text-sm mt-1">Designed by Lee Akpareva MBA, MA</p>
                  </div>
                </div>

              </div>
            </div>

            {/* BlueFin Project */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content Side */}
              <div className="space-y-6 order-last lg:order-first">
                <h3 className="text-3xl md:text-4xl font-bold text-white">BlueFin Deck</h3>
                <p className="text-blue-300 text-lg font-medium">Portable Raspberry Pi Command Center</p>

                <p className="text-lg text-gray-200 leading-relaxed">
                  BlueFin Deck is a portable Raspberry Pi-powered command center packed into a rugged case.
                  It features an illuminated mini keyboard, built-in display, and internal Pi board, letting you
                  code, hack, and monitor systems anywhere—from your desk to the field—just by flipping it open and powering on.
                </p>

                <div className="space-y-4">
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30">
                    <h4 className="text-white font-semibold mb-2">Key Features</h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Illuminated mini keyboard for low-light operations</li>
                      <li>• Built-in display with real-time system monitoring</li>
                      <li>• Internal Raspberry Pi board for full computing power</li>
                      <li>• Rugged portable case for field deployment</li>
                      <li>• Instant-on capability for rapid response</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/40 backdrop-blur-sm rounded-lg p-4 border border-blue-400/50">
                    <p className="text-blue-200 font-medium">Status: Development Phase</p>
                    <p className="text-gray-300 text-sm mt-1">Designed by Lee Akpareva MBA, MA</p>
                  </div>
                </div>
              </div>

              {/* Video Side */}
              <div className="order-first lg:order-last">
                <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-4 border border-white/10">
                  <ProjectVideo
                    src="/videos/bluefin-deck.mp4"
                    title="BlueFin Deck - Portable Raspberry Pi Command Center"
                    className="w-full bg-black overflow-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Back to Solutions CTA */}
          <div className="text-center mt-16">
            <Link href="/solutions">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Solutions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}