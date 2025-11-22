"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, X, Cog, Microscope as Microchip, Shield, Phone, Cpu, Sparkles, Folder } from "lucide-react";
import Link from "next/link";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";
import { useSession } from "next-auth/react";
import Script from "next/script";

export default function NavadaRoboticsApp() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('submitting');
    setSubscribeMessage('');

    try {
      const response = await fetch('/api/emails/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: subscribeEmail, source: 'homepage' }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribeStatus('success');
        setSubscribeMessage(data.message || 'Thank you for subscribing! Stay tuned for updates.');
        setSubscribeEmail('');
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setSubscribeStatus('error');
      setSubscribeMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
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
              <Link href="/about" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                About
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
        {/* Spline Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <iframe
            src='https://my.spline.design/galaxyrollercoaster-UubfnPNkcpn15yoZy8gNcgB3/'
            frameBorder='0'
            width='100%'
            height='100%'
            className="absolute inset-0"
            style={{ pointerEvents: 'auto' }}
            loading="lazy"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center px-4 py-16 min-h-screen">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-balance tracking-tighter leading-tight md:leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400 px-4">
              Navigating Artistic Vision with Advanced Digital Assistance
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
              NAVADA explores how technology advances our future through the intersection of AI, robotics, and creative
              innovation. I support the growth and adoption of AI tools focused on pioneering research and products in
              robotics and automation for the next generation.
            </p>

          </div>
        </div>
      </section>

      {/* Innovation Showcase Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400 tracking-tighter">Innovation Showcase</h3>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover my latest breakthroughs in AI-powered robotics, creative technology, and digital assistance platforms
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 group hover:bg-black/60 transition-all duration-300 touch-manipulation">
                  <OptimizedImage
                    src="/AiCreative.png"
                    alt="Artistic vision meets robotic precision"
                    width={400}
                    height={192}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-3 md:p-4">
                    <h4 className="text-purple-200 font-semibold mb-1 md:mb-2 text-sm md:text-base">AI Creative Assistant</h4>
                    <p className="text-gray-200 text-xs md:text-sm">Artistic vision meets robotic precision</p>
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 group hover:bg-black/60 transition-all duration-300 touch-manipulation">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    aria-label="Advanced digital assistance for the future"
                  >
                    <source src="/untitled video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="p-3 md:p-4">
                    <h4 className="text-purple-200 font-semibold mb-1 md:mb-2 text-sm md:text-base">Next-Gen Automation</h4>
                    <p className="text-gray-200 text-xs md:text-sm">Advanced digital assistance for the future</p>
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 group hover:bg-black/60 transition-all duration-300 touch-manipulation">
                  <OptimizedImage
                    src="/ManvsMachine.png"
                    alt="Empowering the next generation of innovators"
                    width={400}
                    height={192}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-3 md:p-4">
                    <h4 className="text-purple-200 font-semibold mb-1 md:mb-2 text-sm md:text-base">Research Platform</h4>
                    <p className="text-gray-200 text-xs md:text-sm">Empowering the next generation of innovators</p>
                  </div>
                </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400 tracking-tighter">Events</h3>
          </div>

          <div className="max-w-md mx-auto">
            <Link
              href="https://caffeine.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="block group mb-6"
            >
              <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all duration-300 touch-manipulation">
                <OptimizedImage
                  src="/event-2.png"
                  alt="AI UNLOCKED: Learn & Network Day"
                  width={400}
                  height={300}
                  className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            <div className="text-center">
              <Link
                href="https://internetcomputer.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl transition-all duration-300 border border-purple-500/50 hover:border-purple-400 group"
              >
                <span>Explore Internet Computer</span>
                <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/30 via-purple-800/40 to-purple-900/30 border border-purple-500/30 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent"></div>
              <div className="relative p-8 md:p-12">
                <div className="text-center mb-8">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Stay Ahead</h3>
                  <p className="text-gray-300 text-lg">Get exclusive updates</p>
                </div>

                {subscribeStatus === 'success' && (
                  <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm">
                    <p className="text-green-300 text-center text-sm">{subscribeMessage}</p>
                  </div>
                )}

                {subscribeStatus === 'error' && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
                    <p className="text-red-300 text-center text-sm">{subscribeMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <input
                    type="email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="flex-1 px-5 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 focus:bg-black/60 transition-all duration-300 backdrop-blur-sm"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={subscribeStatus === 'submitting'}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 border border-purple-500/50 hover:border-purple-400"
                  >
                    {subscribeStatus === 'submitting' ? '...' : 'Subscribe'}
                  </Button>
                </form>
              </div>
            </div>
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
            <span className="text-gray-400">Solutions</span>
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

      {/* ElevenLabs AudioNative Script */}
      <Script
        src="https://elevenlabs.io/player/audioNativeHelper.js"
        strategy="afterInteractive"
        type="text/javascript"
      />
    </div>
  );
}