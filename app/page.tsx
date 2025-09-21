"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Cog, Microscope as Microchip, Shield, Phone, Brain, Cpu, Sparkles, Folder } from "lucide-react";
import Link from "next/link";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";
import { useSession } from "next-auth/react";

// Dynamic import for Vortex to prevent hydration issues
const Vortex = dynamic(() => import("@/components/ui/vortex").then(mod => ({ default: mod.Vortex })), {
  ssr: false
});

export default function NavadaRoboticsApp() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <h1 className="text-2xl font-bold text-white">NAVADA</h1>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 p-3 rounded-lg min-w-12 min-h-12 flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="transition-transform duration-200">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </div>
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-all duration-200">
                Solutions
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-all duration-200">
                About
              </Link>
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-all duration-200">
                Agent Lee
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-all duration-200">
                Contact
              </Link>
            </nav>
          </div>

          {/* Mobile navigation */}
          <div className={`md:hidden mt-4 pb-4 border-t border-gray-800 pt-4 transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <nav className="flex flex-col space-y-1">
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                Solutions
              </Link>
              <Link href="/news" className="relative text-white hover:text-cyan-400 transition-all duration-200 font-semibold py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                <span className="relative z-10">News</span>
                <span className="absolute top-2 left-12 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                About
              </Link>
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                Agent Lee
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen">
        {isMounted ? (
          <Vortex
            backgroundColor="#000000"
            rangeY={400}
            particleCount={300}
            baseHue={280}
            baseSpeed={0.5}
            rangeSpeed={1.0}
            className="flex items-center justify-center px-4 py-16 min-h-screen"
          >
            <div className="container mx-auto text-center">
            <Badge variant="secondary" className="mb-4 bg-purple-900 text-purple-200 border-purple-700">
              AI • Robotics • Digital Innovation
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-balance tracking-tighter leading-tight md:leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400 px-4">
              Navigating Artistic Vision with Advanced Digital Assistance
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
              NAVADA explores how technology advances our future through the intersection of AI, robotics, and creative
              innovation. I support the growth and adoption of AI tools focused on pioneering research and products in
              robotics and automation for the next generation.
            </p>

            {/* Value Props Row */}
            <div className="flex flex-row justify-center md:grid md:grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-8">
              <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-purple-400 bg-purple-400/10 flex items-center justify-center">
                  <Cpu className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                </div>
                <span className="text-gray-300 font-medium text-sm md:text-base text-center">AI Processing</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-purple-400 bg-purple-400/10 flex items-center justify-center">
                  <Cog className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                </div>
                <span className="text-gray-300 font-medium text-sm md:text-base text-center">Robotics</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-purple-400 bg-purple-400/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                </div>
                <span className="text-gray-300 font-medium text-sm md:text-base text-center">Innovation</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link href="/solutions" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 bg-purple-600 hover:bg-purple-700 transition-all duration-200 min-h-12">
                  Explore Innovation
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 bg-transparent border-purple-400 text-purple-400 hover:bg-purple-900 transition-all duration-200 min-h-12">
                  My Vision
                </Button>
              </Link>
            </div>
            </div>
          </Vortex>
        ) : (
          <div className="flex items-center justify-center px-4 py-16 min-h-screen bg-black">
            <div className="container mx-auto text-center">
              <Badge variant="secondary" className="mb-4 bg-purple-900 text-purple-200 border-purple-700">
                AI • Robotics • Digital Innovation
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400">
                Navigating Artistic Vision with Advanced Digital Assistance
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                NAVADA explores how technology advances our future through the intersection of AI, robotics, and creative
                innovation. I support the growth and adoption of AI tools focused on pioneering research and products in
                robotics and automation for the next generation.
              </p>

              {/* Value Props Row */}
              <div className="flex flex-row justify-center md:grid md:grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-8">
                <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-purple-400 bg-purple-400/10 flex items-center justify-center">
                    <Cpu className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                  </div>
                  <span className="text-gray-300 font-medium text-sm md:text-base text-center">AI Processing</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-purple-400 bg-purple-400/10 flex items-center justify-center">
                    <Cog className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                  </div>
                  <span className="text-gray-300 font-medium text-sm md:text-base text-center">Robotics</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-purple-400 bg-purple-400/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                  </div>
                  <span className="text-gray-300 font-medium text-sm md:text-base text-center">Innovation</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/solutions">
                  <Button size="lg" className="text-lg px-8 bg-purple-600 hover:bg-purple-700 transition-all duration-200">
                    Explore Innovation
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent border-purple-400 text-purple-400 hover:bg-purple-900 transition-all duration-200">
                    My Vision
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Innovation Showcase Section */}
      <section className="py-16 px-4 bg-black overflow-x-hidden cursor-glow">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Innovation Showcase</h3>
            <p className="text-gray-100 max-w-2xl mx-auto">
              Discover my latest breakthroughs in AI-powered robotics, creative technology, and digital assistance platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 group hover:bg-black/60 transition-all duration-300">
              <OptimizedImage
                src="/AiCreative.png"
                alt="Artistic vision meets robotic precision"
                width={400}
                height={192}
                className="w-full h-48 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="p-4">
                <h4 className="text-purple-200 font-semibold mb-2">AI Creative Assistant</h4>
                <p className="text-gray-200 text-sm">Artistic vision meets robotic precision</p>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 group hover:bg-black/60 transition-all duration-300">
              <OptimizedImage
                src="/NextGenAuto.png"
                alt="Advanced digital assistance for the future"
                width={400}
                height={192}
                className="w-full h-48 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="p-4">
                <h4 className="text-purple-200 font-semibold mb-2">Next-Gen Automation</h4>
                <p className="text-gray-200 text-sm">Advanced digital assistance for the future</p>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 group hover:bg-black/60 transition-all duration-300">
              <OptimizedImage
                src="/ManvsMachine.png"
                alt="Empowering the next generation of innovators"
                width={400}
                height={192}
                className="w-full h-48 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="p-4">
                <h4 className="text-purple-200 font-semibold mb-2">Research Platform</h4>
                <p className="text-gray-200 text-sm">Empowering the next generation of innovators</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Projects Section */}
      <section id="active-projects" className="py-16 px-4 bg-black overflow-x-hidden cursor-glow">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Active Projects</h3>
            <p className="text-gray-100 max-w-2xl mx-auto">
              Current development initiatives pushing the boundaries of AI and robotics technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Link href="/robotics" className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] h-full cursor-glow">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 text-center h-full flex flex-col hover:bg-black/60 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center backdrop-blur-sm">
                  <Folder className="w-8 h-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
                  Robotics
                </h4>
                <p className="text-gray-200 text-sm flex-grow">
                  Advanced robotic systems and automation projects
                </p>
              </div>
            </Link>

            <Link href="/ai-agent-development" className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] h-full cursor-glow">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 text-center h-full flex flex-col hover:bg-black/60 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center backdrop-blur-sm">
                  <Folder className="w-8 h-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
                  AI Agent Development
                </h4>
                <p className="text-gray-200 text-sm flex-grow">
                  Intelligent agent systems and conversational AI
                </p>
              </div>
            </Link>

            <Link href="/computer-vision" className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] h-full cursor-glow">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 text-center h-full flex flex-col hover:bg-black/60 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center backdrop-blur-sm">
                  <Folder className="w-8 h-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
                  Computer Vision
                </h4>
                <p className="text-gray-200 text-sm flex-grow">
                  Image processing and visual recognition systems
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-xl font-bold text-white">NAVADA</span>
          </div>
          <p className="text-gray-300 mb-2">© 2024 NAVADA. All rights reserved.</p>
          <p className="text-gray-400 text-sm mb-2">Navigating Artistic Vision with Advanced Digital Assistance</p>
          <p className="text-purple-400 text-sm">Designed & Developed by Lee Akpareva MBA, MA</p>
        </div>
      </footer>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-gray-800 md:hidden">
        <div className="flex justify-around py-2">
          <Link href="/solutions" className="flex flex-col items-center py-2 px-1 text-xs transition-all duration-200">
            <Microchip className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Research</span>
          </Link>
          <Link href="/agent-lee" className="flex flex-col items-center py-2 px-1 text-xs transition-all duration-200">
            <Brain className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Agent Lee</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center py-2 px-1 text-xs transition-all duration-200">
            <Shield className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">About</span>
          </Link>
          <Link href="/contact" className="flex flex-col items-center py-2 px-1 text-xs transition-all duration-200">
            <Phone className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Contact</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}