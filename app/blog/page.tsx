"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
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
              <Link href="/blog" className="text-purple-400 font-semibold transition-all duration-200">
                PoC
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
              <Link href="/blog" className="text-purple-400 font-semibold transition-all duration-200 py-3 px-2 rounded-lg bg-gray-800/50 min-h-12 flex items-center">
                PoC
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 flex-1">
            PoC
          </h1>
          <Button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center space-x-2 min-h-12 ${
              voiceEnabled
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="h-5 w-5" />
                <span className="hidden sm:inline">Voice On</span>
              </>
            ) : (
              <>
                <VolumeX className="h-5 w-5" />
                <span className="hidden sm:inline">Voice Off</span>
              </>
            )}
          </Button>
        </div>

        <div className="max-w-6xl mx-auto space-y-8 pb-safe">
          <article className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 md:p-8 mb-8 border border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-blue-400">
              NAVADA AI Shopping Platform
            </h2>

            <div className="w-full min-h-[500px] md:min-h-[800px]">
              <iframe
                src="https://claude.site/public/artifacts/43b00b86-ede4-47c9-a67f-b22e821565f3/embed"
                title="Claude Artifact"
                className="w-full h-[500px] md:h-[800px] rounded-lg border border-gray-600"
                style={{ border: 'none' }}
                allow="clipboard-write"
                allowFullScreen
              />
            </div>
          </article>

          <article className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 md:p-8 mb-8 border border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-blue-400">
              Featured Content
            </h2>

            <div className="w-full min-h-[500px] md:min-h-[800px]">
              <iframe
                src="https://claude.site/public/artifacts/ad141410-6c6b-4406-96d8-4bfcd6f9e9b4/embed"
                title="Claude Artifact"
                className="w-full h-[500px] md:h-[800px] rounded-lg border border-gray-600"
                style={{ border: 'none' }}
                allow="clipboard-write"
                allowFullScreen
              />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
