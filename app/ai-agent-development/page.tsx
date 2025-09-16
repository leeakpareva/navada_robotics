"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Menu, X, ArrowLeft, Brain, MessageCircle, Zap, Bot, Code, Database } from "lucide-react"
import Link from "next/link"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { BeamsBackground } from "@/components/ui/beams-background"

export default function AIAgentDevelopmentPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const aiAgentProjects = [
    {
      title: "Conversational AI Assistant",
      description: "Advanced natural language processing agent for customer service and support.",
      image: "/placeholder-ai-1.jpg",
      tags: ["NLP", "Conversational AI", "Customer Support"],
      status: "Production"
    },
    {
      title: "Intelligent Task Automation",
      description: "AI agents that automate complex business processes and workflows.",
      image: "/placeholder-ai-2.jpg",
      tags: ["Automation", "Workflow", "Business Intelligence"],
      status: "In Development"
    },
    {
      title: "Multi-Modal AI Agent",
      description: "Agent capable of processing text, images, and voice inputs for comprehensive assistance.",
      image: "/placeholder-ai-3.jpg",
      tags: ["Multi-Modal", "Computer Vision", "Speech Recognition"],
      status: "Beta"
    }
  ]

  const capabilities = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Machine Learning",
      description: "Advanced ML algorithms for intelligent agent behavior and learning"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Natural Language Processing",
      description: "Sophisticated language understanding and generation capabilities"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Processing",
      description: "Fast response times and efficient processing for seamless interactions"
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Agent Architecture",
      description: "Scalable and robust agent frameworks and system design"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Custom Development",
      description: "Tailored AI agents for specific use cases and requirements"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Knowledge Integration",
      description: "Seamless integration with existing data sources and knowledge bases"
    }
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      <BeamsBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <h1 className="text-2xl font-bold text-white">NAVADA</h1>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 p-2 rounded"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="transition-transform duration-200">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </div>
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-purple-400 transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2 inline" />
                Home
              </Link>
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-all duration-200">
                Solutions
              </Link>
              <Link href="/services" className="text-white hover:text-purple-400 transition-all duration-200">
                Services
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
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-white hover:text-purple-400 transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2 inline" />
                Home
              </Link>
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-all duration-200">
                Solutions
              </Link>
              <Link href="/services" className="text-white hover:text-purple-400 transition-all duration-200">
                Services
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-all duration-200">
                About
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-all duration-200">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center bg-purple-900/30 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
            <Brain className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-purple-200 text-sm">Intelligent AI Agents & Systems</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400">
            AI Agent Development
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Building the next generation of intelligent AI agents. From conversational assistants to autonomous decision-making systems, 
            we create AI agents that understand, learn, and adapt to complex environments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 bg-purple-600 hover:bg-purple-700 transition-all duration-200">
                Build AI Agent
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/agent-lee">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent border-purple-400 text-purple-400 hover:bg-purple-900 transition-all duration-200">
                Try Agent Lee
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">AI Agent Capabilities</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Comprehensive AI development expertise spanning machine learning, natural language processing, and intelligent systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <Card key={index} className="bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                    {capability.icon}
                  </div>
                  <h3 className="text-white text-lg font-semibold text-center mb-2">{capability.title}</h3>
                  <p className="text-gray-300 text-sm text-center">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">AI Agent Projects</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Current development and research in intelligent agent systems and AI automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiAgentProjects.map((project, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:border-purple-400/50 bg-black/30 border-white/20 overflow-hidden backdrop-blur-sm hover:bg-black/40 cursor-glow">
                <div className="relative overflow-hidden">
                  <OptimizedImage
                    src={project.image || `/placeholder.svg?height=192&width=400&text=${encodeURIComponent(project.title)}`}
                    alt={project.title}
                    width={400}
                    height={192}
                    quality={85}
                    className="w-full h-48 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'Production' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      project.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      project.status === 'In Development' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      project.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      project.status === 'Prototype' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-white group-hover:text-purple-200 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Our AI Agents?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our AI agents are designed with cutting-edge technology and industry best practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Lightning Fast Responses</h3>
                <p className="text-gray-300 text-sm">Optimized for real-time interactions with sub-second response times</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Brain className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Continuous Learning</h3>
                <p className="text-gray-300 text-sm">AI agents that improve over time through machine learning and user feedback</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Scalable Architecture</h3>
                <p className="text-gray-300 text-sm">Built to handle enterprise-level workloads with robust scaling capabilities</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Database className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Secure & Private</h3>
                <p className="text-gray-300 text-sm">Enterprise-grade security with privacy-first design principles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-black">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Deploy AI Agents?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Transform your business with intelligent AI agents. From customer service to complex automation, 
            we'll help you build the perfect AI solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 bg-purple-600 hover:bg-purple-700 transition-all duration-200">
                Start Development
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/agent-lee">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent border-purple-400 text-purple-400 hover:bg-purple-900 transition-all duration-200">
                Experience Agent Lee
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-4 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-xl font-bold text-white">NAVADA</span>
          </div>
          <p className="text-gray-300 mb-1 text-sm">© 2024 NAVADA. All rights reserved.</p>
          <p className="text-gray-400 text-xs mb-1">Navigating Artistic Vision with Advanced Digital Assistance</p>
          <p className="text-purple-400 text-xs mb-0">Designed & Developed by Lee Akpareva MBA, MA</p>
        </div>
      </footer>
    </div>
  )
}