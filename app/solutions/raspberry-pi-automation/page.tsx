"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BeamsBackground } from "@/components/ui/beams-background"
import {
  CircuitBoard,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Menu,
  X,
  Cpu,
  Settings,
  Zap,
  Shield,
  Home,
  Factory,
  Smartphone,
  BarChart3,
  CheckCircle,
  Calendar,
  MapPin,
  Briefcase
} from "lucide-react"

export default function RaspberryPiAutomationPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const keyMetrics = [
    { label: "Market Size", value: "$12.8B", growth: "+15.2%", icon: DollarSign },
    { label: "Job Growth", value: "23%", growth: "by 2030", icon: TrendingUp },
    { label: "Avg Salary", value: "$95K", growth: "annually", icon: Users },
    { label: "Companies", value: "5000+", growth: "hiring", icon: Building }
  ]

  const realWorldUseCases = [
    {
      title: "Smart Manufacturing",
      description: "Automated quality control and predictive maintenance systems using computer vision and IoT sensors.",
      industry: "Manufacturing",
      impact: "40% reduction in defects",
      icon: Factory,
      examples: ["Ford Motor Company", "Siemens", "General Electric"]
    },
    {
      title: "Home Automation Systems",
      description: "Complete smart home solutions with voice control, security monitoring, and energy management.",
      industry: "Consumer Tech",
      impact: "30% energy savings",
      icon: Home,
      examples: ["Amazon Alexa", "Google Nest", "Philips Hue"]
    },
    {
      title: "Agricultural Monitoring",
      description: "Precision farming with soil monitoring, automated irrigation, and crop health analysis.",
      industry: "Agriculture",
      impact: "25% yield increase",
      icon: Cpu,
      examples: ["John Deere", "Climate Corporation", "FarmBot"]
    }
  ]

  const jobOpportunities = [
    {
      title: "IoT Solutions Engineer",
      company: "Microsoft",
      salary: "$120,000 - $160,000",
      location: "Seattle, WA",
      type: "Full-time",
      skills: ["Raspberry Pi", "Python", "Azure IoT", "C++"]
    },
    {
      title: "Automation Systems Developer",
      company: "Tesla",
      salary: "$110,000 - $150,000",
      location: "Austin, TX",
      type: "Full-time",
      skills: ["Embedded Systems", "Linux", "GPIO Programming", "MQTT"]
    },
    {
      title: "Robotics Software Engineer",
      company: "Boston Dynamics",
      salary: "$130,000 - $180,000",
      location: "Waltham, MA",
      type: "Full-time",
      skills: ["ROS", "Computer Vision", "Machine Learning", "Hardware Integration"]
    }
  ]

  const industryApplications = [
    {
      category: "Industrial IoT",
      applications: ["Predictive Maintenance", "Asset Tracking", "Environmental Monitoring"],
      marketValue: "$178B by 2025",
      growthRate: "22.4% CAGR"
    },
    {
      category: "Smart Cities",
      applications: ["Traffic Management", "Waste Management", "Energy Grid Optimization"],
      marketValue: "$2.5T by 2025",
      growthRate: "18.9% CAGR"
    },
    {
      category: "Healthcare IoT",
      applications: ["Patient Monitoring", "Medical Device Automation", "Telemedicine"],
      marketValue: "$659B by 2025",
      growthRate: "25.1% CAGR"
    }
  ]

  const technicalSpecs = [
    {
      component: "Raspberry Pi 5",
      specs: "2.4GHz quad-core ARM Cortex-A76, 4GB/8GB RAM",
      performance: "2-3x faster than Pi 4",
      applications: "Edge AI, Computer Vision, IoT Gateways"
    },
    {
      component: "GPIO Interface",
      specs: "40-pin header with 26 GPIO pins",
      performance: "3.3V logic, 16mA max current",
      applications: "Sensor Integration, Motor Control, LED Arrays"
    },
    {
      component: "Communication",
      specs: "Wi-Fi 6, Bluetooth 5.0, Gigabit Ethernet",
      performance: "Low latency, high throughput",
      applications: "IoT Connectivity, Data Streaming, Remote Control"
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
              <Link href="/solutions" className="text-purple-400 font-medium">
                Solutions
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                About
              </Link>
              <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                Learning
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
                <Link href="/solutions" className="text-purple-400 font-medium">
                  Solutions
                </Link>
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                  About
                </Link>
                <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">
                  Learning
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
      <BeamsBackground intensity="medium" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/solutions">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Research Areas
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-300 backdrop-blur-sm">
                  <CircuitBoard className="h-8 w-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Raspberry Pi Automation
                </h1>
              </div>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Transform industries with intelligent automation systems powered by Raspberry Pi.
                From smart manufacturing to home automation, discover how edge computing is
                revolutionizing the way we interact with technology.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/50">
                  Edge Computing
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/50">
                  IoT Integration
                </Badge>
                <Badge className="bg-green-500/20 text-green-200 border-green-400/50">
                  Real-time Processing
                </Badge>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-center">Market Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {keyMetrics.map((metric, index) => (
                      <div key={index} className="text-center p-4 bg-purple-500/10 rounded-lg">
                        <metric.icon className="h-6 w-6 mx-auto mb-2 text-purple-300" />
                        <div className="text-2xl font-bold text-white">{metric.value}</div>
                        <div className="text-sm text-gray-300">{metric.label}</div>
                        <div className="text-xs text-green-400">{metric.growth}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </BeamsBackground>

      {/* Real-World Use Cases */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Real-World Applications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {realWorldUseCases.map((useCase, index) => (
              <Card key={index} className="bg-black/30 border-white/20 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <useCase.icon className="h-8 w-8 text-purple-300" />
                    <CardTitle className="text-white">{useCase.title}</CardTitle>
                  </div>
                  <Badge className="w-fit bg-blue-500/20 text-blue-200 border-blue-400/50">
                    {useCase.industry}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{useCase.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">Impact:</span>
                    <span className="text-green-400 font-semibold">{useCase.impact}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block mb-2">Used by:</span>
                    <div className="flex flex-wrap gap-1">
                      {useCase.examples.map((company, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Applications Dashboard */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Industry Applications & Market Data
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {industryApplications.map((industry, index) => (
              <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-center">{industry.category}</CardTitle>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-300">{industry.marketValue}</div>
                    <div className="text-sm text-green-400">{industry.growthRate}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {industry.applications.map((app, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">{app}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Opportunities */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Career Opportunities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobOpportunities.map((job, index) => (
              <Card key={index} className="bg-black/30 border-white/20 hover:border-purple-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{job.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-purple-300" />
                    <span className="text-purple-300 font-semibold">{job.company}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Salary:</span>
                      <span className="text-green-400 font-semibold">{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{job.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">Required Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-purple-400/50 text-purple-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Technical Specifications
          </h2>

          <div className="space-y-6">
            {technicalSpecs.map((spec, index) => (
              <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{spec.component}</h3>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Specifications</span>
                      <span className="text-gray-300">{spec.specs}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Performance</span>
                      <span className="text-green-400">{spec.performance}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Applications</span>
                      <span className="text-purple-300">{spec.applications}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Ready to Start Your Automation Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and engineers building the future with Raspberry Pi automation systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              Explore Learning Resources
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3">
              Contact for Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}