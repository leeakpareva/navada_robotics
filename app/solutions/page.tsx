"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BeamsBackground } from "@/components/ui/beams-background"
import {
  Cpu,
  Zap,
  Shield,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  CircuitBoard,
  Cog,
  Microscope as Microchip,
  Phone,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { isLearningHubEnabled } from "@/lib/feature-flags"
import { OptimizedImage } from "@/components/ui/optimized-image"

export default function SolutionsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)

  const solutionCategories = [
    {
      title: "Predictions",
      description:
        "AI-driven forecasting and trend analysis for robotics, automation, and emerging technologies. Leverage machine learning models to predict market trends, technology adoption, and innovation opportunities.",
      icon: <Cpu className="h-8 w-8" />,
      features: ["Market Analysis", "Technology Trends", "Future Insights"],
      iframe: 'https://my.spline.design/dotwaves-JIuaTJuTmw3YGtM3cBu9kHPg/',
      link: "/solutions/predictions",
      gradient: "from-blue-900/20 to-purple-900/20",
    },
    {
      title: "Events",
      description:
        "Stay updated with the latest robotics conferences, AI summits, and innovation showcases. Connect with industry leaders and discover breakthrough technologies at premier events worldwide.",
      icon: <Zap className="h-8 w-8" />,
      features: ["Conferences", "Networking", "Industry Updates"],
      image: "/Educa.png",
      link: "/solutions/events",
      gradient: "from-purple-900/20 to-pink-900/20",
    },
    {
      title: "Resources",
      description:
        "Comprehensive collection of tools, frameworks, and educational materials for robotics development. Access documentation, tutorials, and open-source projects to accelerate your innovation journey.",
      icon: <CircuitBoard className="h-8 w-8" />,
      features: ["Documentation", "Tutorials", "Open Source"],
      iframe: 'https://my.spline.design/voidspiral-5AEFysnY1qMRjM3vDGfbR7yt/',
      link: "/solutions/resources",
      gradient: "from-green-900/20 to-blue-900/20",
    },
    {
      title: "Projects",
      description:
        "Explore cutting-edge robotics and AI projects from research labs and innovation centers. Discover real-world applications, prototypes, and breakthrough technologies shaping the future.",
      icon: <Shield className="h-8 w-8" />,
      features: ["Innovation", "Prototypes", "Research Labs"],
      iframe: 'https://my.spline.design/blackbotfuturisticrobotconcept-LUNh1H421N6ObaaU6aZYPU9R/',
      link: "/solutions/projects",
      gradient: "from-orange-900/20 to-red-900/20",
    },
  ]

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % solutionCategories.length)
  }

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + solutionCategories.length) % solutionCategories.length)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSection()
      if (e.key === 'ArrowLeft') prevSection()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
              <Link href="/solutions" className="text-purple-400 font-medium">
                Solutions
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                About
              </Link>
{isLearningHubEnabled() && (
                <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                  Learning
                </Link>
              )}
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
                <Link href="/solutions" className="text-purple-400 font-medium">
                  Solutions
                </Link>
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                  About
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

      {/* Full-Page Solution Sections */}
      <div className="relative min-h-screen overflow-hidden">
        {solutionCategories.map((solution, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSection ? 'translate-x-0' :
              index < currentSection ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <BeamsBackground
              intensity="subtle"
              className={`min-h-screen bg-gradient-to-br ${solution.gradient} relative`}
            >
              <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Content Side */}
                  <div className="space-y-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-300 backdrop-blur-sm border border-purple-400/30">
                        {solution.icon}
                      </div>
                      <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                        {solution.title}
                      </h2>
                    </div>

                    <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                      {solution.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {solution.features.map((feature, featureIndex) => (
                        <Badge
                          key={featureIndex}
                          variant="outline"
                          className="text-sm px-4 py-2 border-purple-400/50 text-purple-200 bg-purple-500/20 backdrop-blur-sm hover:bg-purple-500/30 transition-colors"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Explore CTA */}
                    <div className="pt-8">
                      <Link href={solution.link}>
                        <Button
                          size="lg"
                          className="text-lg px-8 py-4 bg-purple-600 hover:bg-purple-700 transition-all duration-200 group"
                        >
                          Explore {solution.title}
                          <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Visual Side */}
                  <div className="order-first lg:order-last">
                    <div className="relative">
                      <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-4 border border-white/10">
                        {solution.iframe ? (
                          <div className="w-full h-[400px] md:h-[500px] bg-black rounded-2xl overflow-hidden">
                            {index === currentSection || Math.abs(index - currentSection) <= 1 ? (
                              <iframe
                                src={solution.iframe}
                                frameBorder="0"
                                width="100%"
                                height="100%"
                                className="w-full h-full"
                                style={solution.splineStyle ? { transform: 'scale(0.8)', transformOrigin: 'center' } : {}}
                                loading="lazy"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                sandbox="allow-scripts allow-same-origin allow-presentation"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                  <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                  <p>Loading 3D Experience...</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <OptimizedImage
                            src={solution.image || `/placeholder.svg?height=500&width=600&text=${encodeURIComponent(solution.title)}`}
                            alt={solution.title}
                            width={600}
                            height={500}
                            quality={90}
                            className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Indicator */}
              <div className="absolute top-8 right-8">
                <div className="bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="text-white text-sm font-medium">
                    {index + 1} of {solutionCategories.length}
                  </span>
                </div>
              </div>
            </BeamsBackground>
          </div>
        ))}

        {/* Navigation Arrows */}
        {currentSection > 0 && (
          <Button
            onClick={prevSection}
            variant="outline"
            size="icon"
            className="fixed bottom-8 left-8 z-50 w-14 h-14 rounded-full bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {currentSection < solutionCategories.length - 1 && (
          <Button
            onClick={nextSection}
            variant="outline"
            size="icon"
            className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Progress Dots */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex space-x-3">
            {solutionCategories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSection
                    ? 'bg-purple-400 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-gray-800 md:hidden">
        <div className="flex justify-around py-2">
          <Link href="/solutions" className="flex flex-col items-center py-2 px-3 text-xs">
            <Microchip className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Research</span>
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
