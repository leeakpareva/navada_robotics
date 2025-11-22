"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BeamsBackground } from "@/components/ui/beams-background"
import { Menu, X, Microscope as Microchip, Shield, Phone } from "lucide-react"
import Link from "next/link"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { isLearningHubEnabled } from "@/lib/feature-flags"

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      text: "Lee transformed my understanding of AI development in just weeks. His teaching style breaks down complex concepts into digestible lessons. I went from zero coding experience to building my first AI app. Absolutely life-changing!",
      image: "🎓"
    },
    {
      name: "Marcus Rodriguez",
      role: "Startup Founder",
      text: "What sets Lee apart is his ability to teach ANYONE regardless of their background. He guided me from complete beginner to deploying production AI systems. His patience and expertise are unmatched.",
      image: "🚀"
    },
    {
      name: "Priya Patel",
      role: "Career Switcher to AI",
      text: "I never thought I could understand AI until I met Lee. His teaching methodology is pure magic - he makes the impossible feel achievable. Within 3 months, I landed my dream job in AI development.",
      image: "💡"
    },
    {
      name: "James Williams",
      role: "High School Student",
      text: "Lee believes in every student's potential. At 16, I built my first AI chatbot under his mentorship. He doesn't just teach code - he teaches you how to think like a developer. Inspiring beyond words!",
      image: "🎯"
    },
    {
      name: "Elena Volkova",
      role: "Small Business Owner",
      text: "Lee's gift is making AI accessible to everyone. No tech jargon, no condescension - just clear, powerful teaching. He helped me automate my business with AI tools I built myself. Revolutionary!",
      image: "⭐"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change testimonial every 5 seconds

    return () => clearInterval(timer)
  }, [testimonials.length])

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

      {/* About Section */}
      <BeamsBackground 
        intensity="subtle" 
        className="py-16 px-4"
      >
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About NAVADA</h2>

            <div className="mb-8">
              <div className="flex justify-center">
                <OptimizedImage
                  src="/AboutNavada.png"
                  alt="NAVADA Robotics Laboratory"
                  width={768}
                  height={320}
                  quality={90}
                  priority
                  className="max-w-2xl rounded-lg border border-purple-400/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <p className="text-lg text-gray-100 mb-8 text-pretty">
              Founded by Lee Akpareva MBA, MA, NAVADA Robotics is a cutting-edge startup at the forefront of Raspberry
              Pi-based robotics research. I specialize in developing accessible, cost-effective robotic solutions that
              bridge the gap between academic research and practical applications. My expertise combines deep technical
              expertise with educational innovation to advance the field of robotics through open-source platforms.
            </p>

            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 mb-8 border border-purple-400/50 hover:bg-black/40 transition-all duration-300">
              <h3 className="text-2xl font-semibold text-white mb-6">Leadership</h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <OptimizedImage
                    src="/Profileimage.png"
                    alt="Lee Akpareva, Founder & CEO"
                    width={128}
                    height={128}
                    quality={95}
                    className="w-32 h-32 rounded-full border-2 border-purple-400/70 object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xl font-medium text-white mb-2">Lee Akpareva MBA, MA</p>
                  <p className="text-purple-200 font-medium mb-3">Founder & CEO | Designer & Developer</p>
                  <p className="text-gray-200 text-sm mb-3">
                    I designed and developed this entire application, weaving together my passions for AI, robotics, 
                    and full-stack development into a transformative digital experience. With advanced degrees in business 
                    and academia, I combine deep technical expertise in Next.js, TypeScript, and AI integration with 
                    strategic vision to democratize robotics education worldwide.
                  </p>
                  <p className="text-gray-200 text-sm mb-3">
                    My expertise spans the full spectrum of modern innovation - from crafting elegant code and integrating 
                    OpenAI APIs to synthesizing voice experiences and designing intuitive user journeys. Beyond technology, 
                    I&apos;m a passionate Fashion Designer and Shoe Maker, finding inspiration in the intersection of form and function.
                    When I need to clear my mind and spark creativity, you&apos;ll find me roller blading through the streets of London.
                  </p>
                  <p className="text-gray-200 text-sm mb-3">
                    This project embodies my commitment to breaking down barriers between cutting-edge technology and practical 
                    education. I believe in making the complex accessible, the innovative approachable, and the future tangible 
                    for the next generation of creators and innovators.
                  </p>
                  <a 
                    href="https://www.linkedin.com/feed/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-purple-300 hover:text-purple-200 transition-colors duration-200 text-sm font-medium"
                  >
                    Connect on LinkedIn →
                  </a>
                </div>
              </div>
            </div>

            {/* Testimonials Slideshow */}
            <div className="mt-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">What Students Say</h3>
              <div className="relative min-h-[300px] flex items-center justify-center">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      index === currentTestimonial
                        ? 'opacity-100 transform translate-y-0'
                        : 'opacity-0 transform translate-y-4 pointer-events-none'
                    }`}
                  >
                    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-8 md:p-12 border border-purple-400/50 hover:border-purple-400 transition-all duration-300 shadow-xl">
                      <div className="text-center">
                        <div className="text-6xl mb-6">{testimonial.image}</div>
                        <p className="text-lg md:text-xl text-gray-100 italic mb-6 leading-relaxed">
                          &quot;{testimonial.text}&quot;
                        </p>
                        <div className="border-t border-purple-400/30 pt-6">
                          <p className="text-xl font-bold text-white mb-1">{testimonial.name}</p>
                          <p className="text-purple-300 font-medium">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slideshow indicators */}
              <div className="flex justify-center mt-8 gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'w-8 bg-purple-400'
                        : 'w-2 bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
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
