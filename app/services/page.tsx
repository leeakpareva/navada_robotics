"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BeamsBackground } from "@/components/ui/beams-background"
import { Menu, X, Cog, Microscope as Microchip, Wrench, Shield, Phone, Brain } from "lucide-react"
import Link from "next/link"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { OptimizedVideo } from "@/components/ui/optimized-video"

export default function ServicesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const services = [
    {
      title: "Raspberry Pi Robot Development",
      description:
        "Custom robot design and development using Raspberry Pi platforms, from concept to prototype to production-ready systems.",
      image: "/Robcop.png",
    },
    {
      title: "Research Consultation",
      description:
        "Expert guidance on robotics research projects, grant applications, and academic collaboration opportunities.",
      image: "/ResearchConsultation.png",
    },
    {
      title: "Educational Workshops",
      description:
        "Hands-on training sessions for students and faculty on Raspberry Pi robotics, programming, and system integration.",
      image: "/EducationnalWorkshops.png",
    },
    {
      title: "Python Programming for Robotics",
      description:
        "Comprehensive Python training focused on robotics applications, including OpenCV for computer vision, TensorFlow for AI, and GPIO programming for hardware control. From beginner to advanced levels.",
      image: "/Pythonsnake.png",
    },
    {
      title: "Prototype Development",
      description:
        "Rapid prototyping services for robotics concepts, including 3D printing, PCB design, and software development.",
      image: "/PrototypeDev.png",
    },
    {
      title: "Technical Documentation",
      description:
        "Comprehensive documentation services including research papers, technical manuals, and educational materials.",
      image: "/TechnicalDocs.png",
    },
  ]

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
              <Link href="/services" className="text-purple-400 font-medium">
                Services
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                About
              </Link>
              <Link href="/ai-analytics" className="text-white hover:text-purple-400 transition-colors">
                AI Analytics
              </Link>
              <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
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
                <Link href="/services" className="text-purple-400 font-medium">
                  Services
                </Link>
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                  About
                </Link>
                <Link href="/ai-analytics" className="text-white hover:text-purple-400 transition-colors">
                  AI Analytics
                </Link>
                <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
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

      {/* Services Section */}
      <BeamsBackground 
        intensity="subtle" 
        className="py-16 px-4"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">My Services</h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Comprehensive support for Raspberry Pi robotics research and development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:border-purple-400/50 bg-black/30 border-white/20 overflow-hidden backdrop-blur-sm hover:bg-black/40"
              >
                <div className="relative overflow-hidden">
                  {service.isVideo ? (
                    <OptimizedVideo
                      src={service.image}
                      className="w-full h-48"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <OptimizedImage
                      src={service.image || `/placeholder.svg?height=192&width=400&text=${encodeURIComponent(service.title)}`}
                      alt={service.title}
                      width={400}
                      height={192}
                      quality={85}
                      className="w-full h-48 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-lg mb-3 text-white group-hover:text-purple-200 transition-colors duration-300">{service.title}</h4>
                  <p className="text-gray-200 text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
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
            <Wrench className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Services</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center py-2 px-3 text-xs">
            <Shield className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">About</span>
          </Link>
          <Link href="/agent-lee" className="flex flex-col items-center py-2 px-3 text-xs">
            <Brain className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Agent Lee</span>
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
