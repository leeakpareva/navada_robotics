"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Cog, Microscope as Microchip, Wrench, Shield, Phone } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Cog className="h-8 w-8 text-purple-400" />
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
              <Link href="/about" className="text-purple-400 font-medium">
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
                <Link href="/services" className="text-white hover:text-purple-400 transition-colors">
                  Services
                </Link>
                <Link href="/about" className="text-purple-400 font-medium">
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

      {/* About Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-300 mb-6">About NAVADA</h2>

            <div className="mb-8">
              <img
                src="/placeholder.svg?height=300&width=600&text=NAVADA+Robotics+Laboratory"
                alt="NAVADA Robotics Laboratory"
                className="w-full max-w-2xl mx-auto rounded-lg border border-purple-500"
              />
            </div>

            <p className="text-lg text-gray-300 mb-8 text-pretty">
              Founded by Lee Akpareva MBA, MA, NAVADA Robotics is a cutting-edge startup at the forefront of Raspberry
              Pi-based robotics research. We specialize in developing accessible, cost-effective robotic solutions that
              bridge the gap between academic research and practical applications. Our team combines deep technical
              expertise with educational innovation to advance the field of robotics through open-source platforms.
            </p>

            <div className="bg-gray-800 rounded-lg p-8 mb-8 border border-purple-500">
              <h3 className="text-2xl font-semibold text-purple-400 mb-6">Leadership</h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <img
                    src="/placeholder.svg?height=128&width=128&text=Lee+Akpareva+CEO"
                    alt="Lee Akpareva, Founder & CEO"
                    className="w-32 h-32 rounded-full border-2 border-purple-400"
                  />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xl font-medium text-white mb-2">Lee Akpareva MBA, MA</p>
                  <p className="text-purple-300 font-medium mb-3">Founder & CEO</p>
                  <p className="text-gray-300 text-sm">
                    With advanced degrees in business and academia, Lee brings a unique perspective to robotics
                    research, combining technical innovation with strategic business acumen to make robotics education
                    accessible worldwide.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-purple-400 mb-6">Our Workspace</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <img
                  src="/placeholder.svg?height=200&width=300&text=NAVADA+Research+Lab"
                  alt="NAVADA Research Laboratory"
                  className="w-full rounded-lg border border-gray-700"
                />
                <img
                  src="/placeholder.svg?height=200&width=300&text=Development+Workshop"
                  alt="Development Workshop"
                  className="w-full rounded-lg border border-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
                <div className="text-gray-300">Research Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">15+</div>
                <div className="text-gray-300">University Partnerships</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">200+</div>
                <div className="text-gray-300">Students & Researchers Trained</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
