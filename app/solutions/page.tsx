"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BGPattern } from "@/components/ui/bg-pattern"
import {
  Cpu,
  Zap,
  Shield,
  Menu,
  X,
  ChevronRight,
  CircuitBoard,
  Cog,
  Microscope as Microchip,
  Wrench,
  Phone,
} from "lucide-react"
import Link from "next/link"

export default function SolutionsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const roboticSolutions = [
    {
      title: "Raspberry Pi Automation",
      description:
        "Build intelligent automation systems using Raspberry Pi 4 and 5. Perfect for industrial IoT, home automation, and research applications with GPIO control, sensor integration, and real-time processing.",
      icon: <CircuitBoard className="h-8 w-8" />,
      features: ["Cost-Effective", "Open Source", "Modular Design"],
      image: "/raspberry-pi-automation-system-with-sensors-and-ci.png",
    },
    {
      title: "AI Research Platforms",
      description:
        "Deploy machine learning models on edge devices using Raspberry Pi clusters. Supports TensorFlow Lite, OpenCV, and custom neural networks for computer vision and autonomous robotics research.",
      icon: <Cpu className="h-8 w-8" />,
      features: ["Edge Computing", "Neural Networks", "Computer Vision"],
      image: "/raspberry-pi-cluster-for-ai-machine-learning-resea.png",
    },
    {
      title: "Educational Robotics",
      description:
        "Comprehensive robotics education kits designed for universities and research institutions. Includes curriculum, hardware kits, and software tools for hands-on learning in robotics and AI.",
      icon: <Zap className="h-8 w-8" />,
      features: ["STEM Education", "Research Tools", "Prototyping"],
      image: "/educational-robotics-kit-with-raspberry-pi-for-stu.png",
    },
    {
      title: "IoT Integration",
      description:
        "Connect robotic systems to cloud platforms and mobile apps. Features MQTT protocols, REST APIs, and real-time data visualization for remote monitoring and control of robotic fleets.",
      icon: <Shield className="h-8 w-8" />,
      features: ["Sensor Networks", "Remote Monitoring", "Data Analytics"],
      image: "/iot-raspberry-pi-sensors-connected-to-cloud-dashbo.png",
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
              <Link href="/solutions" className="text-purple-400 font-medium">
                Solutions
              </Link>
              <Link href="/services" className="text-white hover:text-purple-400 transition-colors">
                Services
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
                <Link href="/solutions" className="text-purple-400 font-medium">
                  Solutions
                </Link>
                <Link href="/services" className="text-white hover:text-purple-400 transition-colors">
                  Services
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

      {/* Solutions Section */}
      <section className="py-16 px-4 relative">
        <BGPattern 
          variant="grid" 
          mask="fade-edges" 
          size={32} 
          fill="rgba(139, 92, 246, 0.1)"
        />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-300 mb-4">My Research Areas</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover my innovative Raspberry Pi-based robotics research and development projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roboticSolutions.map((solution, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 bg-gray-800 border-gray-700 hover:border-purple-500 relative z-20"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      solution.image ||
                      `/placeholder.svg?height=192&width=400&text=${encodeURIComponent(solution.title)}`
                    }
                    alt={solution.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-800/50 to-transparent" />
                </div>

                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-purple-900 rounded-lg text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      {solution.icon}
                    </div>
                    <CardTitle className="text-xl text-white">{solution.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-300">{solution.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {solution.features.map((feature, featureIndex) => (
                      <Badge
                        key={featureIndex}
                        variant="outline"
                        className="text-xs border-purple-500 text-purple-300 bg-purple-900"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-white hover:bg-purple-600 hover:text-white"
                  >
                    Learn More
                    <ChevronRight className="h-4 w-4" />
                  </Button>
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
            <Microchip className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Research</span>
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
            <Phone className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Contact</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
