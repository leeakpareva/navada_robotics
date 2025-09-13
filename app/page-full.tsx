"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import * as BootstrapIcons from "react-bootstrap-icons"
import Link from "next/link"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Vortex } from "@/components/ui/vortex"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { GradientBackground } from "@/components/ui/gradient-background"

export default function NavadaRoboticsApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-gray-800 animate-in slide-in-from-top duration-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
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
                {isMounted && (isMenuOpen ? <BootstrapIcons.XLg className="h-6 w-6" /> : <BootstrapIcons.List className="h-6 w-6" />)}
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
                href="/ai-analytics"
                className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-105 relative group"
              >
                AI Analytics
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/agent-lee"
                className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-105 relative group"
              >
                Agent Lee
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/contact"
                className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-105 relative group"
              >
                Contact
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
                  href="/ai-analytics"
                  className="text-white hover:text-purple-400 transition-all duration-200 hover:translate-x-2"
                >
                  AI Analytics
                </Link>
                <Link
                  href="/agent-lee"
                  className="text-white hover:text-purple-400 transition-all duration-200 hover:translate-x-2"
                >
                  Agent Lee
                </Link>
                <a
                  href="#active-projects"
                  className="text-white hover:text-purple-400 transition-all duration-200 hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Active Projects
                </a>
                <Link
                  href="/contact"
                  className="text-white hover:text-purple-400 transition-all duration-200 hover:translate-x-2"
                >
                  Contact
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
          rangeY={400}
          particleCount={150}
          baseHue={280}
          baseSpeed={0.3}
          rangeSpeed={0.8}
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
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400">
              Navigating Artistic Vision with Advanced Digital Assistance
            </h2>
            <p
              className={`text-xl text-gray-300 mb-8 max-w-3xl mx-auto text-pretty transition-all duration-1000 delay-1000 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
              }`}
              style={{ animationDelay: "1s" }}
            >
              NAVADA explores how technology advances our future through the intersection of AI, robotics, and creative
              innovation. I support the growth and adoption of AI tools focused on pioneering research and products in
              robotics and automation for the next generation.
            </p>
            
            {/* Value Props Row */}
            <div
              className={`flex flex-row justify-center items-center gap-8 mb-8 transition-all duration-1000 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
              }`}
              style={{ animationDelay: "1.2s" }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-400/10 flex items-center justify-center">
                  {isMounted && <BootstrapIcons.Cpu className="w-6 h-6 text-purple-400" />}
                </div>
                <span className="text-gray-300 font-medium text-sm">AI Processing</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-400/10 flex items-center justify-center">
                  {isMounted && <BootstrapIcons.Gear className="w-6 h-6 text-purple-400" />}
                </div>
                <span className="text-gray-300 font-medium text-sm">Robotics</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-400/10 flex items-center justify-center">
                  {isMounted && <BootstrapIcons.Stars className="w-6 h-6 text-purple-400" />}
                </div>
                <span className="text-gray-300 font-medium text-sm">Innovation</span>
              </div>
            </div>
            
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
              }`}
              style={{ animationDelay: "1.5s" }}
            >
              <Link href="/solutions">
                <Button
                  size="lg"
                  className="text-lg px-8 bg-purple-600 hover:bg-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  Explore Innovation
                  {isMounted && <BootstrapIcons.ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />}
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

      {/* Innovation Showcase Section */}
      <section className="py-16 px-4 bg-black relative overflow-hidden">
        {/* Background with shooting stars */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.1)_0%,rgba(0,0,0,0.8)_80%)]" />
          <div className="stars absolute inset-0" />
        </div>

        {/* Shooting star layer with NAVADA colors */}
        {isMounted && <ShootingStars
          starColor="#a855f7"
          trailColor="#06b6d4"
          minSpeed={15}
          maxSpeed={35}
          minDelay={2000}
          maxDelay={5000}
        />}

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h3
              className={`text-3xl font-bold text-white mb-4 transition-all duration-700 delay-300 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
              }`}
            >
              Innovation Showcase
            </h3>
            <p
              className={`text-gray-100 max-w-2xl mx-auto transition-all duration-700 delay-500 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
              }`}
            >
              Discover my latest breakthroughs in AI-powered robotics, creative technology, and digital assistance
              platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className={`bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 transition-all duration-700 delay-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 group hover:bg-black/60 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0"
              }`}
            >
              <OptimizedImage
                src="/AiCreative.png"
                alt="Artistic vision meets robotic precision"
                width={400}
                height={192}
                priority={true}
                className="w-full h-48 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="p-4">
                <h4 className="text-purple-200 font-semibold mb-2 transition-colors duration-200 group-hover:text-white">
                  AI Creative Assistant
                </h4>
                <p className="text-gray-200 text-sm">Artistic vision meets robotic precision</p>
              </div>
            </div>

            <div
              className={`bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 transition-all duration-700 delay-900 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 group hover:bg-black/60 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0"
              }`}
            >
              <OptimizedImage
                src="/NextGenAuto.png"
                alt="Advanced digital assistance for the future"
                width={400}
                height={192}
                className="w-full h-48 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="p-4">
                <h4 className="text-purple-200 font-semibold mb-2 transition-colors duration-200 group-hover:text-white">
                  Next-Gen Automation
                </h4>
                <p className="text-gray-200 text-sm">Advanced digital assistance for the future</p>
              </div>
            </div>

            <div
              className={`bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 transition-all duration-700 delay-1000 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 group hover:bg-black/60 ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0"
              }`}
            >
              <OptimizedImage
                src="/ManvsMachine.png"
                alt="Empowering the next generation of innovators"
                width={400}
                height={192}
                className="w-full h-48 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="p-4">
                <h4 className="text-purple-200 font-semibold mb-2 transition-colors duration-200 group-hover:text-white">
                  Research Platform
                </h4>
                <p className="text-gray-200 text-sm">Empowering the next generation of innovators</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .stars {
            background-image: 
              radial-gradient(2px 2px at 20px 30px, rgba(168,85,247,0.8), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 40px 70px, rgba(6,182,212,0.8), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 50px 160px, rgba(139,92,246,0.6), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 90px 40px, rgba(168,85,247,0.8), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 130px 80px, rgba(6,182,212,0.8), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 160px 120px, rgba(139,92,246,0.6), rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 200px 200px;
            animation: twinkle 5s ease-in-out infinite;
            opacity: 0.6;
          }

          @keyframes twinkle {
            0% { opacity: 0.4; }
            50% { opacity: 0.8; }
            100% { opacity: 0.4; }
          }
        `}</style>
      </section>

      {/* Active Projects Section */}
      <section id="active-projects" className="relative">
        {isMounted ? (
          <GradientBackground
            className="py-16 px-4"
            gradients={[
              "linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 100%)",
              "linear-gradient(135deg, #8e2de2 0%, #4a00e0 50%, #2d1b69 100%)"
            ]}
            animationDuration={20}
            animationDelay={2}
            overlay={true}
            overlayOpacity={0.6}
          >
            <div className="container mx-auto relative z-20">
              <div className="text-center mb-12">
                <h3
                  className={`text-3xl font-bold text-white mb-4 transition-all duration-700 delay-300 ${
                    isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
                  }`}
                >
                  Active Projects
                </h3>
                <p
                  className={`text-gray-100 max-w-2xl mx-auto transition-all duration-700 delay-500 ${
                    isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
                  }`}
                >
                  Current development initiatives pushing the boundaries of AI and robotics technology
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div
                  className={`group cursor-pointer transition-all duration-700 delay-700 hover:scale-105 h-full ${
                    isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0"
                  }`}
                >
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300 text-center h-full flex flex-col hover:bg-black/40">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center backdrop-blur-sm">
                      {isMounted && <BootstrapIcons.Folder className="w-8 h-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />}
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
                      Robotics
                    </h4>
                    <p className="text-gray-200 text-sm flex-grow">
                      Advanced robotic systems and automation projects
                    </p>
                  </div>
                </div>

                <div
                  className={`group cursor-pointer transition-all duration-700 delay-900 hover:scale-105 h-full ${
                    isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0"
                  }`}
                >
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300 text-center h-full flex flex-col hover:bg-black/40">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center backdrop-blur-sm">
                      {isMounted && <BootstrapIcons.Folder className="w-8 h-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />}
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
                      AI Agent Development
                    </h4>
                    <p className="text-gray-200 text-sm flex-grow">
                      Intelligent agent systems and conversational AI
                    </p>
                  </div>
                </div>

                <div
                  className={`group cursor-pointer transition-all duration-700 delay-1100 hover:scale-105 h-full ${
                    isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0"
                  }`}
                >
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300 text-center h-full flex flex-col hover:bg-black/40">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center backdrop-blur-sm">
                      {isMounted && <BootstrapIcons.Folder className="w-8 h-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />}
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
                      Computer Vision
                    </h4>
                    <p className="text-gray-200 text-sm flex-grow">
                      Image processing and visual recognition systems
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GradientBackground>
        ) : (
          <div className="py-16 px-4 bg-gradient-to-br from-gray-900 to-black">
            <div className="container mx-auto relative z-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">Active Projects</h3>
                <p className="text-gray-100 max-w-2xl mx-auto">
                  Current development initiatives pushing the boundaries of AI and robotics technology
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
                  <h4 className="text-xl font-semibold text-white mb-2">Robotics</h4>
                  <p className="text-gray-200 text-sm">Advanced robotic systems and automation projects</p>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
                  <h4 className="text-xl font-semibold text-white mb-2">AI Agent Development</h4>
                  <p className="text-gray-200 text-sm">Intelligent agent systems and conversational AI</p>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
                  <h4 className="text-xl font-semibold text-white mb-2">Computer Vision</h4>
                  <p className="text-gray-200 text-sm">Image processing and visual recognition systems</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>


      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-gray-800 md:hidden animate-in slide-in-from-bottom duration-500">
        <div className="flex justify-around py-2">
          <Link
            href="/solutions"
            className="flex flex-col items-center py-2 px-2 text-xs transition-all duration-200 hover:scale-110 active:scale-95"
          >
            {isMounted && <BootstrapIcons.Cpu className="h-5 w-5 text-gray-400 mb-1 transition-colors duration-200 hover:text-purple-400" />}
            <span className="text-gray-400 transition-colors duration-200 hover:text-purple-400">Research</span>
          </Link>
          <Link
            href="/services"
            className="flex flex-col items-center py-2 px-2 text-xs transition-all duration-200 hover:scale-110 active:scale-95"
          >
            {isMounted && <BootstrapIcons.Wrench className="h-5 w-5 text-gray-400 mb-1 transition-colors duration-200 hover:text-purple-400" />}
            <span className="text-gray-400 transition-colors duration-200 hover:text-purple-400">Services</span>
          </Link>
          <Link
            href="/agent-lee"
            className="flex flex-col items-center py-2 px-2 text-xs transition-all duration-200 hover:scale-110 active:scale-95"
          >
            {isMounted && <BootstrapIcons.LightbulbFill className="h-5 w-5 text-gray-400 mb-1 transition-colors duration-200 hover:text-purple-400" />}
            <span className="text-gray-400 transition-colors duration-200 hover:text-purple-400">Agent Lee</span>
          </Link>
          <Link
            href="/about"
            className="flex flex-col items-center py-2 px-2 text-xs transition-all duration-200 hover:scale-110 active:scale-95"
          >
            {isMounted && <BootstrapIcons.ShieldCheck className="h-5 w-5 text-gray-400 mb-1 transition-colors duration-200 hover:text-purple-400" />}
            <span className="text-gray-400 transition-colors duration-200 hover:text-purple-400">About</span>
          </Link>
          <Link
            href="/contact"
            className="flex flex-col items-center py-2 px-2 text-xs transition-all duration-200 hover:scale-110 active:scale-95"
          >
            {isMounted && <BootstrapIcons.Telephone className="h-5 w-5 text-gray-400 mb-1 transition-colors duration-200 hover:text-purple-400" />}
            <span className="text-gray-400 transition-colors duration-200 hover:text-purple-400">Contact</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
