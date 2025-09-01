"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BeamsBackground } from "@/components/ui/beams-background"
import { ArrowRight, Menu, X, Phone, Mail, MapPin, Cog, Microscope as Microchip, Wrench, Shield } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
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
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
                Agent Lee
              </Link>
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
                <Link href="/services" className="text-white hover:text-purple-400 transition-colors">
                  Services
                </Link>
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                  About
                </Link>
                <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
                  Agent Lee
                </Link>
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
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Ready to collaborate on robotics research or need consultation for your next project? I'm here to
              help advance your robotics initiatives with Raspberry Pi technology.
            </p>
          </div>

          <div className="mb-12">
            <img
              src="/placeholder.svg?height=300&width=800&text=NAVADA+Office+Building"
              alt="NAVADA Robotics Office"
              className="w-full max-w-4xl mx-auto rounded-lg border border-purple-400/50 backdrop-blur-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:border-purple-400/50 transition-colors bg-black/30 border-white/20 backdrop-blur-sm hover:bg-black/40">
              <CardContent className="pt-6">
                <Phone className="h-8 w-8 text-purple-300 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Phone</h4>
                <p className="text-gray-200">+44 79535237704</p>
                <p className="text-gray-300 text-sm mt-1">Mon-Fri 9AM-6PM GMT</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:border-purple-400/50 transition-colors bg-black/30 border-white/20 backdrop-blur-sm hover:bg-black/40">
              <CardContent className="pt-6">
                <Mail className="h-8 w-8 text-purple-300 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Email</h4>
                <p className="text-gray-200">leekapareva@hmail.com</p>
                <p className="text-gray-300 text-sm mt-1">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:border-purple-400/50 transition-colors bg-black/30 border-white/20 backdrop-blur-sm hover:bg-black/40">
              <CardContent className="pt-6">
                <MapPin className="h-8 w-8 text-purple-300 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Location</h4>
                <p className="text-gray-200">London, UK</p>
                <p className="text-gray-300 text-sm mt-1">Research & Development Hub</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 mb-8">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">My Workspace Environment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <img
                src="/placeholder.svg?height=250&width=400&text=Consultation+Room"
                alt="NAVADA Consultation Room"
                className="w-full rounded-lg border border-white/20 backdrop-blur-sm"
              />
              <img
                src="/placeholder.svg?height=250&width=400&text=Research+Collaboration+Space"
                alt="Research Collaboration Space"
                className="w-full rounded-lg border border-white/20 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="text-lg px-8 bg-purple-500/20 hover:bg-purple-500/30 backdrop-blur-sm border border-purple-400/50 text-white hover:text-purple-200">
              Schedule Research Meeting
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
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
          <Link href="/contact" className="flex flex-col items-center py-2 px-3 text-xs">
            <Phone className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Contact</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
