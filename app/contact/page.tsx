"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BeamsBackground } from "@/components/ui/beams-background"
import { ArrowRight, Menu, X, Phone, Mail, MapPin, Cog, Microscope as Microchip, Shield, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { isLearningHubEnabled } from "@/lib/feature-flags"

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openFaqItem, setOpenFaqItem] = useState<number | null>(null)

  const faqItems = [
    {
      question: "What is Artificial Intelligence and how is it transforming industries?",
      answer: (
        <div className="space-y-3">
          <p>Artificial Intelligence (AI) is a technology that enables machines to simulate human intelligence, learning from data to make decisions and solve problems. AI is transforming industries through:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Healthcare:</strong> AI assists in medical diagnosis, drug discovery, and personalized treatment plans</li>
            <li><strong>Finance:</strong> Fraud detection, algorithmic trading, and risk assessment</li>
            <li><strong>Transportation:</strong> Autonomous vehicles and traffic optimization</li>
            <li><strong>Manufacturing:</strong> Predictive maintenance, quality control, and automation</li>
            <li><strong>Retail:</strong> Personalized recommendations and inventory management</li>
          </ul>
          <p>AI technologies include machine learning, natural language processing, computer vision, and robotics, each contributing to more efficient and intelligent systems.</p>
        </div>
      )
    },
    {
      question: "How do robotics and AI work together in modern applications?",
      answer: (
        <div className="space-y-3">
          <p>Robotics and AI are synergistic technologies that enhance each other's capabilities:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Computer Vision:</strong> AI enables robots to "see" and interpret their environment</li>
            <li><strong>Machine Learning:</strong> Robots learn from experience to improve performance</li>
            <li><strong>Natural Language Processing:</strong> Allows robots to understand and respond to human commands</li>
            <li><strong>Path Planning:</strong> AI algorithms help robots navigate complex environments</li>
            <li><strong>Collaborative Robotics:</strong> AI enables safe human-robot interaction in workspaces</li>
          </ul>
          <p>Applications include autonomous vehicles, surgical robots, warehouse automation, and smart home assistants. At NAVADA, we specialize in integrating AI with Raspberry Pi-based robotics for research and educational purposes.</p>
        </div>
      )
    },
    {
      question: "What makes Next.js the ideal framework for modern web development?",
      answer: (
        <div className="space-y-3">
          <p>Next.js is a powerful React framework that provides an optimal developer experience and excellent performance:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Server-Side Rendering (SSR):</strong> Improves SEO and initial page load times</li>
            <li><strong>Static Site Generation (SSG):</strong> Pre-renders pages for maximum performance</li>
            <li><strong>API Routes:</strong> Build full-stack applications with built-in API endpoints</li>
            <li><strong>Automatic Code Splitting:</strong> Optimizes bundle sizes for faster loading</li>
            <li><strong>Image Optimization:</strong> Built-in image optimization for better performance</li>
            <li><strong>TypeScript Support:</strong> First-class TypeScript support for better development experience</li>
          </ul>
          <p>Next.js is perfect for everything from simple websites to complex applications like e-commerce platforms, dashboards, and AI-powered web applications.</p>
        </div>
      )
    },
    {
      question: "How is IoT revolutionizing connectivity and smart systems?",
      answer: (
        <div className="space-y-3">
          <p>Internet of Things (IoT) connects physical devices to the internet, enabling smart, interconnected systems:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Smart Homes:</strong> Connected appliances, security systems, and energy management</li>
            <li><strong>Industrial IoT:</strong> Predictive maintenance, supply chain optimization, and real-time monitoring</li>
            <li><strong>Healthcare IoT:</strong> Wearable devices, remote patient monitoring, and smart medical equipment</li>
            <li><strong>Smart Cities:</strong> Traffic management, environmental monitoring, and public safety systems</li>
            <li><strong>Agriculture:</strong> Precision farming, soil monitoring, and automated irrigation systems</li>
          </ul>
          <p>IoT devices collect vast amounts of data that, when combined with AI and machine learning, create intelligent systems that can predict, adapt, and optimize automatically. Raspberry Pi is an excellent platform for IoT prototyping and education.</p>
        </div>
      )
    },
    {
      question: "How can I become an AI Developer? What skills and steps are needed?",
      answer: (
        <div className="space-y-3">
          <p>Becoming an AI Developer requires a combination of technical skills, practical experience, and continuous learning:</p>

          <div className="mt-4">
            <h5 className="text-purple-300 font-semibold mb-2">Essential Programming Skills:</h5>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Python:</strong> Primary language for AI/ML (TensorFlow, PyTorch, scikit-learn)</li>
              <li><strong>R:</strong> Statistical analysis and data science</li>
              <li><strong>JavaScript:</strong> Web-based AI applications and visualization</li>
              <li><strong>SQL:</strong> Database management and data querying</li>
            </ul>
          </div>

          <div className="mt-4">
            <h5 className="text-purple-300 font-semibold mb-2">Mathematical Foundations:</h5>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Linear Algebra and Statistics</li>
              <li>Calculus and Probability Theory</li>
              <li>Discrete Mathematics</li>
            </ul>
          </div>

          <div className="mt-4">
            <h5 className="text-purple-300 font-semibold mb-2">Learning Path:</h5>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Start with Python programming and basic data analysis</li>
              <li>Learn machine learning concepts and algorithms</li>
              <li>Practice with real datasets using Kaggle and GitHub projects</li>
              <li>Specialize in areas like NLP, Computer Vision, or Robotics</li>
              <li>Build a portfolio of AI projects</li>
              <li>Consider advanced degrees or certifications</li>
              <li>Join AI communities and attend conferences</li>
            </ol>
          </div>

          <div className="mt-4">
            <h5 className="text-purple-300 font-semibold mb-2">Recommended Resources:</h5>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Online courses: Coursera, edX, Udacity AI Nanodegrees</li>
              <li>Books: "Hands-On Machine Learning" by Aurélien Géron</li>
              <li>Practice platforms: Kaggle, Google Colab, Jupyter Notebooks</li>
              <li>Open source projects: Contribute to TensorFlow, PyTorch, or scikit-learn</li>
            </ul>
          </div>

          <p className="mt-4">At NAVADA, we offer personalized AI learning paths and hands-on robotics projects to accelerate your journey into AI development. Contact us to discuss your learning goals and get started with practical AI projects.</p>
        </div>
      )
    }
  ]

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
              <Link href="/contact" className="text-purple-400 font-medium">
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
                <Link href="/contact" className="text-purple-400 font-medium">
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Contact Section */}
      <BeamsBackground 
        intensity="subtle" 
        className="py-16 px-4"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Ready to collaborate on robotics research or need consultation for your next project? I'm here to
              help advance your robotics initiatives with Raspberry Pi technology.
            </p>
          </div>

          <div className="mb-12">
            <div className="w-full max-w-4xl mx-auto h-64 md:h-80 rounded-lg overflow-hidden border border-purple-400/50">
              <OptimizedImage
                src="/Contact.png"
                alt="Get in Touch - NAVADA Robotics Contact"
                width={800}
                height={320}
                className="w-full h-full"
                priority
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:border-purple-400/50 transition-colors bg-black/30 border-white/20 backdrop-blur-sm hover:bg-black/40">
              <CardContent className="pt-6">
                <Phone className="h-8 w-8 text-purple-300 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Phone</h4>
                <a href="tel:+447953523704" className="text-gray-200 hover:text-purple-400 transition-colors block">
                  +44 7953 523704
                </a>
                <p className="text-gray-300 text-sm mt-1">Mon-Fri 9AM-6PM GMT</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:border-purple-400/50 transition-colors bg-black/30 border-white/20 backdrop-blur-sm hover:bg-black/40">
              <CardContent className="pt-6">
                <Mail className="h-8 w-8 text-purple-300 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Email</h4>
                <a href="mailto:Lee@navadarobotics.com" className="text-gray-200 hover:text-purple-400 transition-colors block">
                  Lee@navadarobotics.com
                </a>
                <p className="text-gray-300 text-sm mt-1">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:border-purple-400/50 transition-colors bg-black/30 border-white/20 backdrop-blur-sm hover:bg-black/40">
              <CardContent className="pt-6">
                <MapPin className="h-8 w-8 text-purple-300 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Location</h4>
                <p className="text-gray-200">London, UK</p>
                <p className="text-gray-300 text-sm mt-1">Research & Development Hub</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:border-purple-400/50 transition-colors bg-black/30 border-white/20 backdrop-blur-sm hover:bg-black/40">
              <CardContent className="pt-6">
                <HelpCircle className="h-8 w-8 text-purple-300 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">FAQ</h4>
                <p className="text-gray-200">AI, Robotics & IoT</p>
                <p className="text-gray-300 text-sm mt-1">Common Questions</p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Frequently Asked Questions</h3>
              <p className="text-gray-300">Get answers to common questions about AI, Robotics, NextJS, IoT, and becoming an AI Developer</p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm hover:bg-black/40 transition-colors">
                  <CardContent className="p-0">
                    <button
                      onClick={() => setOpenFaqItem(openFaqItem === index ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-purple-500/10 transition-colors"
                    >
                      <h4 className="text-white font-semibold">{item.question}</h4>
                      {openFaqItem === index ? (
                        <ChevronUp className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaqItem === index && (
                      <div className="px-6 pb-6">
                        <div className="text-gray-300 leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="mailto:Lee@navadarobotics.com?subject=Research%20Meeting%20Inquiry&body=Hello%20Lee,%0A%0AI%20would%20like%20to%20schedule%20a%20research%20meeting%20to%20discuss%20robotics%20and%20AI%20projects.%0A%0APlease%20let%20me%20know%20your%20availability.%0A%0ABest%20regards,"
              className="inline-block"
            >
              <Button size="lg" className="text-lg px-8 bg-purple-500/20 hover:bg-purple-500/30 backdrop-blur-sm border border-purple-400/50 text-white hover:text-purple-200">
                Schedule Research Meeting
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
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
            <Shield className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">About</span>
          </Link>
          <Link href="/contact" className="flex flex-col items-center py-2 px-3 text-xs">
            <Phone className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Contact</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
