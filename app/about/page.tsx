"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Microscope as Microchip, Shield, Phone } from "lucide-react"
import Link from "next/link"
import { isLearningHubEnabled } from "@/lib/feature-flags"

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
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
              {/* <Link href="/solutions" className="text-white hover:text-purple-400 transition-colors">
                Solutions
              </Link> */}
              <Link href="/about" className="text-purple-400 font-medium">
                Mission
              </Link>
{isLearningHubEnabled() && (
                <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                  Learning
                </Link>
              )}
              <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                Engage
              </Link>
            </nav>
          </div>

          {/* Mobile navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
              <div className="flex flex-col space-y-3">
                {/* <Link href="/solutions" className="text-white hover:text-purple-400 transition-colors">
                  Solutions
                </Link> */}
                <Link href="/about" className="text-purple-400 font-medium">
                  Mission
                </Link>
                {isLearningHubEnabled() && (
                  <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                    Learning
                  </Link>
                )}
                <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                  Engage
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* About Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">

            {/* WHAT is NAVADA Section */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">WHAT is NAVADA?</h2>

              <div className="space-y-6 text-gray-200 leading-relaxed">
                <p className="text-lg">
                  <strong className="text-white">NAVADA</strong> (Navigating Artistic Vision with Advanced Digital Assistance) is a learning and innovation platform for the age of AI.
                </p>

                <p className="text-lg">
                  It's where real people – founders, students, professionals, and creatives – come to understand, build and apply AI and robotics in the real world.
                </p>

                <p className="text-lg">
                  <strong className="text-white">NAVADA is not just a "tech brand."</strong><br />
                  It's a living classroom and lab:
                </p>

                <ul className="space-y-3 text-lg ml-6">
                  <li>• Workshops and talks that turn complex AI into simple, practical skills</li>
                  <li>• Hands-on projects with robotics, automation and intelligent systems</li>
                  <li>• Coaching for individuals and teams who want to move from curiosity to confident execution</li>
                </ul>

                <p className="text-lg font-medium text-purple-300">
                  If you're serious about the future of work, creativity and business, NAVADA is where you learn to think with AI, build with AI, and lead with AI.
                </p>
              </div>
            </div>

            {/* HOW does NAVADA work Section */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">HOW does NAVADA work?</h2>

              <p className="text-lg text-gray-200 mb-8">
                NAVADA operates on four pillars: <strong className="text-white">Inspire, Educate, Coach, Learn.</strong>
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-3">Inspire – Show what's possible</h3>
                  <ul className="space-y-2 text-gray-200 ml-6">
                    <li>• Live demos, prototypes and real stories of AI and robotics in action</li>
                    <li>• Events and talks that shift people from "AI is hype" to "AI is a tool I can use today"</li>
                    <li>• Clear narratives that connect technology to careers, businesses and everyday life</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-3">Educate – Turn ideas into skills</h3>
                  <ul className="space-y-2 text-gray-200 ml-6">
                    <li>• Structured sessions on AI, robotics, automation, and data</li>
                    <li>• Simple explanations, real examples, and step-by-step guidance</li>
                    <li>• Practical assets: frameworks, canvases, playbooks and code you can actually reuse</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-3">Coach – Help you apply it to your world</h3>
                  <ul className="space-y-2 text-gray-200 ml-6">
                    <li>• 1:1 and small-group coaching for founders, teams and professionals</li>
                    <li>• Support to design AI-powered products, services and workflows</li>
                    <li>• Guidance on strategy, use cases, and how to capture real value – not just build "cool demos"</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-3">Learn – Grow with the community</h3>
                  <ul className="space-y-2 text-gray-200 ml-6">
                    <li>• NAVADA is built on the belief that we're all students of this new era</li>
                    <li>• NAVADA listens, tests, iterates and learns from every session, client, and experiment</li>
                    <li>• NAVADA evolves with each project, so the community always benefits from the latest insights</li>
                  </ul>
                </div>
              </div>

              <p className="text-lg text-gray-200 mt-8 font-medium">
                Everything is designed to be clear, practical and human – no ego, no jargon for the sake of it, just honest learning and real progress.
              </p>
            </div>

            {/* WHY does NAVADA exist Section */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">WHY does NAVADA exist?</h2>

              <div className="space-y-6 text-gray-200 leading-relaxed">
                <p className="text-lg">
                  NAVADA exists because AI and robotics are rewriting the rules of opportunity – and too many people are being left on the outside, watching instead of creating.
                </p>

                <p className="text-lg">
                  <strong className="text-white">NAVADA is here to:</strong>
                </p>

                <ul className="space-y-3 text-lg ml-6">
                  <li>• <strong>Inspire</strong> people who feel behind or overwhelmed by technology</li>
                  <li>• <strong>Educate</strong> those who want to understand how AI and robotics actually work</li>
                  <li>• <strong>Coach</strong> individuals and teams to build, ship and use AI with confidence</li>
                  <li>• <strong>Learn</strong> alongside the community, because this space is evolving every day</li>
                </ul>

                <div className="bg-purple-500/10 border-l-4 border-purple-500 p-6 my-8">
                  <p className="text-lg font-medium text-white">
                    The mission is simple:<br />
                    Turn fear of the future into excitement, direction and action.
                  </p>
                </div>

                <p className="text-lg font-medium text-purple-300">
                  NAVADA is here for the builders, the curious, the career-changers, the leaders and the late-bloomers – anyone who believes they can still reinvent themselves in this new era.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
