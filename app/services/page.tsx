"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Menu, X, Cog, Microscope as Microchip, Wrench, Shield, Phone, Bot } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const services = [
    {
      title: "Raspberry Pi Robot Development",
      description:
        "Custom robot design and development using Raspberry Pi platforms, from concept to prototype to production-ready systems.",
      image: "/placeholder.svg?height=200&width=300&text=Robot+Development",
    },
    {
      title: "Research Consultation",
      description:
        "Expert guidance on robotics research projects, grant applications, and academic collaboration opportunities.",
      image: "/placeholder.svg?height=200&width=300&text=Research+Consultation",
    },
    {
      title: "Educational Workshops",
      description:
        "Hands-on training sessions for students and faculty on Raspberry Pi robotics, programming, and system integration.",
      image: "/placeholder.svg?height=200&width=300&text=Educational+Workshops",
    },
    {
      title: "Python Programming for Robotics",
      description:
        "Comprehensive Python training focused on robotics applications, including OpenCV for computer vision, TensorFlow for AI, and GPIO programming for hardware control. From beginner to advanced levels.",
      image: "/placeholder.svg?height=200&width=300&text=Python+Programming",
    },
    {
      title: "Prototype Development",
      description:
        "Rapid prototyping services for robotics concepts, including 3D printing, PCB design, and software development.",
      image: "/placeholder.svg?height=200&width=300&text=Prototype+Development",
    },
    {
      title: "Technical Documentation",
      description:
        "Comprehensive documentation services including research papers, technical manuals, and educational materials.",
      image: "/placeholder.svg?height=200&width=300&text=Technical+Documentation",
    },
  ]

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
              <Link href="/services" className="text-purple-400 font-medium">
                Services
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                About
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
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-300 mb-4">Our Services</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Comprehensive support for Raspberry Pi robotics research and development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:border-purple-500 bg-gray-800 border-gray-700 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      service.image || `/placeholder.svg?height=192&width=400&text=${encodeURIComponent(service.title)}`
                    }
                    alt={service.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-800/50 to-transparent" />
                </div>
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-lg mb-3 text-purple-300">{service.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
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
            <Wrench className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Services</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center py-2 px-3 text-xs">
            <Shield className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">About</span>
          </Link>
          <Link href="/agent-lee" className="flex flex-col items-center py-2 px-3 text-xs">
            <Bot className="h-5 w-5 text-gray-400 mb-1" />
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
