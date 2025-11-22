"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Microscope as Microchip, Shield, Phone } from "lucide-react"
import Link from "next/link"
import { isLearningHubEnabled } from "@/lib/feature-flags"

export default function AboutPage() {
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
              <Link href="/about" className="text-purple-400 font-medium">
                About
              </Link>
{isLearningHubEnabled() && (
                <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                  Learning
                </Link>
              )}
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
                <Link href="/about" className="text-purple-400 font-medium">
                  About
                </Link>
                {isLearningHubEnabled() && (
                  <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                    Learning
                  </Link>
                )}
                <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* About Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About NAVADA</h2>

            <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
              Founded by Lee Akpareva MBA, MA, NAVADA explores the intersection of AI, robotics, and creative innovation.
            </p>


            {/* Continuous Learning Section */}
            <div className="bg-gradient-to-r from-purple-900/30 via-purple-800/40 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-purple-400/50">
              <h3 className="text-2xl font-semibold text-white mb-4">The Age of AI</h3>
              <p className="text-gray-200 max-w-3xl mx-auto leading-relaxed">
                In this rapidly evolving landscape of artificial intelligence, continuous learning isn't just an advantage it's essential.
                As AI reshapes industries and creates new possibilities daily, staying curious and adaptable becomes the cornerstone of innovation and growth.
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
            <Shield className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">About</span>
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
