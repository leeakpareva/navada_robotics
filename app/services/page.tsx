"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BeamsBackground } from "@/components/ui/beams-background"
import {
  Cpu,
  Zap,
  Shield,
  Menu,
  X,
  ChevronRight,
  Settings,
  Phone,
  Users,
  Target,
  Clock,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { OptimizedImage } from "@/components/ui/optimized-image"

export default function ServicesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const services = [
    {
      title: "Robotics Consulting",
      description:
        "Expert consultation on robotics projects, from concept to deployment. We provide technical guidance, feasibility studies, and custom solutions for your automation needs.",
      icon: <Settings className="h-8 w-8" />,
      features: ["Technical Assessment", "Custom Solutions", "Project Management"],
      image: "/ResearchConsultation.png",
      deliveryProcess: "Initial consultation → Requirements analysis → Solution design → Implementation support",
    },
    {
      title: "Prototype Development",
      description:
        "Rapid prototyping services for robotics and AI applications. From proof-of-concept to working prototypes using cutting-edge technologies and methodologies.",
      icon: <Cpu className="h-8 w-8" />,
      features: ["Rapid Prototyping", "3D Modeling", "Testing & Validation"],
      image: "/PrototypeDev.png",
      deliveryProcess: "Concept validation → Design & modeling → Prototype build → Testing & refinement",
    },
    {
      title: "Educational Workshops",
      description:
        "Comprehensive training programs and workshops for students, professionals, and organizations looking to advance their robotics and AI knowledge.",
      icon: <Users className="h-8 w-8" />,
      features: ["Hands-on Training", "Curriculum Development", "Group Sessions"],
      image: "/EducationnalWorkshops.png",
      deliveryProcess: "Needs assessment → Curriculum design → Workshop delivery → Follow-up support",
    },
    {
      title: "Technical Documentation",
      description:
        "Professional documentation services for robotics projects, including technical specifications, user manuals, and research publications.",
      icon: <CheckCircle className="h-8 w-8" />,
      features: ["Technical Writing", "Research Papers", "User Manuals"],
      image: "/TechnicalDocs.png",
      deliveryProcess: "Content planning → Research & writing → Review & editing → Final delivery",
    },
  ]

  const engagementOptions = [
    {
      title: "Project-Based",
      description: "Fixed-scope projects with defined deliverables and timelines",
      icon: <Target className="h-6 w-6" />,
      duration: "2-12 weeks",
    },
    {
      title: "Retainer Services",
      description: "Ongoing support and consultation on a monthly basis",
      icon: <Clock className="h-6 w-6" />,
      duration: "Monthly",
    },
    {
      title: "Workshop & Training",
      description: "Educational sessions and knowledge transfer programs",
      icon: <Users className="h-6 w-6" />,
      duration: "1-5 days",
    },
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
              <Link href="/services" className="text-purple-400 font-medium">
                Services
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                About
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
                <Link href="/solutions" className="text-white hover:text-purple-400 transition-colors">
                  Solutions
                </Link>
                <Link href="/services" className="text-purple-400 font-medium">
                  Services
                </Link>
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <BeamsBackground 
        intensity="subtle" 
        className="py-16 px-4"
      >
        <div className="container mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Professional Services
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Expert robotics and AI services to bring your ideas to life. From consultation to implementation, 
            we provide comprehensive support for your automation and research needs.
          </p>
        </div>
      </BeamsBackground>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Service Offerings</h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Comprehensive robotics and AI services tailored to your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm hover:bg-black/40"
              >
                <div className="relative overflow-hidden">
                  <OptimizedImage
                    src={service.image}
                    alt={service.title}
                    width={400}
                    height={240}
                    quality={85}
                    className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300 group-hover:bg-purple-500/30 group-hover:text-purple-200 transition-colors backdrop-blur-sm">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-purple-200 transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-200 mb-4">
                    {service.description}
                  </CardDescription>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-purple-300 mb-2">Delivery Process:</h4>
                    <p className="text-sm text-gray-300 italic">{service.deliveryProcess}</p>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.map((feature, featureIndex) => (
                      <Badge
                        key={featureIndex}
                        variant="outline"
                        className="text-xs border-purple-400/50 text-purple-200 bg-purple-500/20 backdrop-blur-sm"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Options Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Engagement Options</h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Flexible engagement models to fit your project timeline and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {engagementOptions.map((option, index) => (
              <Card
                key={index}
                className="text-center bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm hover:bg-black/40 transition-all duration-300"
              >
                <CardHeader>
                  <div className="mx-auto p-3 bg-purple-500/20 rounded-full text-purple-300 w-fit mb-4">
                    {option.icon}
                  </div>
                  <CardTitle className="text-xl text-white">{option.title}</CardTitle>
                  <CardDescription className="text-gray-200">{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-2 text-purple-300">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{option.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                Start a Conversation
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-gray-800 md:hidden">
        <div className="flex justify-around py-2">
          <Link href="/services" className="flex flex-col items-center py-2 px-3 text-xs">
            <Settings className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Services</span>
          </Link>
          <Link href="/solutions" className="flex flex-col items-center py-2 px-3 text-xs">
            <Cpu className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Solutions</span>
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