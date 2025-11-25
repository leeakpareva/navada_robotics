"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, X, Cog, Microscope as Microchip, Shield, Phone, Cpu, Sparkles, Folder } from "lucide-react";
import Link from "next/link";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useSession } from "next-auth/react";
import Script from "next/script";

export default function NavadaRoboticsApp() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const fullTitle = "Navigating Artistic Vision with Advanced Digital Assistance";
  const fullDescription = "NAVADA explores how technology advances our future through the intersection of AI, robotics, and creative innovation. NAVADA supports the growth and adoption of AI tools focused on pioneering research and products in robotics and automation for the next generation.";

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
              {fullTitle}
            </h2>
            <div className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
              <p>{fullDescription}</p>
            </div>

          </div>
        </div>
      </section>

      {/* Research and Education Text Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center">
            <h3 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400 tracking-tighter">Research and Education</h3>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Explore cutting-edge research and educational resources in AI, robotics, and emerging technologies
            </p>
          </div>
        </div>
      </section>

      {/* Research and Education Spline Section */}
      <section className="relative min-h-screen">
        {/* Spline Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <iframe
            src='https://my.spline.design/cutecomputerfollowcursor-ODH6EdF9MB2MdROkRNY7yU3n/'
            frameBorder='0'
            width='100%'
            height='100%'
            className="absolute inset-0"
            style={{ pointerEvents: 'auto' }}
            loading="lazy"
            aria-label="Cute computer follow cursor animation"
          />
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400 tracking-tighter">Upcoming Events</h3>
            <p className="text-gray-300 text-lg font-medium">1/12/2025</p>
            <p className="text-gray-400 text-sm mt-2">NAVADA x Caffeine</p>
          </div>

          <div className="max-w-lg mx-auto">
            <Link
              href="https://caffeine.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="block group mb-6"
            >
              <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all duration-300 touch-manipulation p-4">
                <img
                  src="/event-2.png"
                  alt="AI UNLOCKED: Learn & Network Day"
                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300 rounded-lg"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </Link>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="https://lu.ma/3pv5y80j"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl transition-all duration-300 border border-green-500/50 hover:border-green-400 group"
                >
                  <span>Register Now</span>
                  <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="https://caffeine.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl transition-all duration-300 border border-purple-500/50 hover:border-purple-400 group"
                >
                  <span>Explore Caffeine</span>
                  <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
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


      {/* ElevenLabs AudioNative Script */}
      <Script
        src="https://elevenlabs.io/player/audioNativeHelper.js"
        strategy="afterInteractive"
        type="text/javascript"
      />
    </div>
  );
}