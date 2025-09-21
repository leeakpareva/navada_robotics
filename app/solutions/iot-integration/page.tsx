"use client"

import { useState } from "react"
import Link from "next/link"
import { isLearningHubEnabled } from "@/lib/feature-flags"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BeamsBackground } from "@/components/ui/beams-background"
import {
  Shield,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Menu,
  X,
  Wifi,
  Cloud,
  Database,
  Monitor,
  CheckCircle,
  MapPin,
  Briefcase,
  Smartphone,
  Globe,
  Lock,
  Zap,
  BarChart3,
  Activity,
  AlertTriangle,
  Settings,
  Radio
} from "lucide-react"

export default function IoTIntegrationPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const iotMarketMetrics = [
    { label: "IoT Market Size", value: "£650B", growth: "+24.9% by 2030", icon: DollarSign },
    { label: "Connected Devices", value: "75B", growth: "by 2025", icon: Globe },
    { label: "IoT Engineers", value: "£115K", growth: "avg salary", icon: Users },
    { label: "IoT Companies", value: "15K+", growth: "globally", icon: Building }
  ]

  const iotApplications = [
    {
      title: "Industrial IoT (IIoT)",
      description: "Smart manufacturing with predictive maintenance, real-time monitoring, and automated quality control systems.",
      sector: "Manufacturing",
      impact: "25% efficiency increase",
      icon: Settings,
      protocols: ["MQTT", "OPC-UA", "Modbus", "EtherNet/IP"],
      examples: ["Siemens MindSphere", "GE Predix", "AWS IoT Greengrass"]
    },
    {
      title: "Smart City Infrastructure",
      description: "Connected traffic systems, environmental monitoring, smart lighting, and waste management solutions.",
      sector: "Smart Cities",
      impact: "30% cost reduction",
      icon: Monitor,
      protocols: ["LoRaWAN", "NB-IoT", "5G", "Zigbee"],
      examples: ["Barcelona Smart City", "Singapore Smart Nation", "Amsterdam Circular"]
    },
    {
      title: "Healthcare IoT",
      description: "Remote patient monitoring, smart medical devices, and real-time health data analytics platforms.",
      sector: "Healthcare",
      impact: "40% faster diagnosis",
      icon: Activity,
      protocols: ["BLE", "WiFi 6", "LTE-M", "Thread"],
      examples: ["Philips HealthSuite", "Medtronic CareLink", "Abbott FreeStyle"]
    }
  ]

  const connectivityProtocols = [
    {
      protocol: "MQTT",
      description: "Lightweight messaging for IoT devices",
      useCase: "Real-time telemetry, device control",
      reliability: "High",
      latency: "Low (ms)",
      powerConsumption: "Low"
    },
    {
      protocol: "LoRaWAN",
      description: "Long-range, low-power wireless",
      useCase: "Smart agriculture, environmental monitoring",
      reliability: "Medium",
      latency: "High (seconds)",
      powerConsumption: "Very Low"
    },
    {
      protocol: "5G NR",
      description: "Ultra-reliable low-latency communication",
      useCase: "Autonomous vehicles, industrial automation",
      reliability: "Very High",
      latency: "Ultra Low (<1ms)",
      powerConsumption: "Medium"
    },
    {
      protocol: "Zigbee 3.0",
      description: "Mesh networking for smart homes",
      useCase: "Home automation, building management",
      reliability: "High",
      latency: "Low (ms)",
      powerConsumption: "Low"
    }
  ]

  const securityFrameworks = [
    {
      layer: "Device Security",
      technologies: ["Hardware Security Module (HSM)", "Secure Boot", "Device Identity"],
      threats: "Physical tampering, firmware attacks",
      mitigation: "99.9% attack prevention"
    },
    {
      layer: "Communication Security",
      technologies: ["TLS 1.3", "X.509 Certificates", "End-to-End Encryption"],
      threats: "Man-in-the-middle, eavesdropping",
      mitigation: "256-bit encryption standard"
    },
    {
      layer: "Cloud Security",
      technologies: ["OAuth 2.0", "JWT Tokens", "API Gateway Security"],
      threats: "Data breaches, unauthorized access",
      mitigation: "Multi-factor authentication"
    }
  ]

  const careerOpportunities = [
    {
      title: "IoT Solutions Architect",
      company: "Amazon Web Services",
      salary: "£140,000 - £200,000",
      location: "Seattle, WA",
      type: "Full-time",
      skills: ["AWS IoT Core", "System Architecture", "Edge Computing", "Security"],
      description: "Design and implement large-scale IoT solutions for enterprise clients"
    },
    {
      title: "IoT Security Engineer",
      company: "Cisco Systems",
      salary: "£120,000 - £170,000",
      location: "San Jose, CA",
      type: "Full-time",
      skills: ["Cybersecurity", "Network Protocols", "Penetration Testing", "Risk Assessment"],
      description: "Secure IoT networks and devices against cyber threats"
    },
    {
      title: "Industrial IoT Developer",
      company: "General Electric",
      salary: "£100,000 - £145,000",
      location: "Boston, MA",
      type: "Full-time",
      skills: ["IIoT Platforms", "OPC-UA", "Industrial Protocols", "Data Analytics"],
      description: "Develop IoT solutions for industrial manufacturing and energy sectors"
    },
    {
      title: "IoT Product Manager",
      company: "Google Cloud",
      salary: "£130,000 - £180,000",
      location: "Mountain View, CA",
      type: "Full-time",
      skills: ["Product Strategy", "IoT Platforms", "Market Analysis", "Stakeholder Management"],
      description: "Lead IoT product development and go-to-market strategies"
    }
  ]

  const industryUseCases = [
    {
      industry: "Agriculture",
      applications: ["Precision Farming", "Livestock Monitoring", "Soil Analytics"],
      impact: "20% yield increase, 30% water savings",
      devices: "15M+ connected sensors",
      roi: "300% return on investment"
    },
    {
      industry: "Energy",
      applications: ["Smart Grid", "Renewable Integration", "Energy Storage"],
      impact: "15% efficiency improvement",
      devices: "500M+ smart meters",
      roi: "£200B annual savings"
    },
    {
      industry: "Transportation",
      applications: ["Fleet Management", "Predictive Maintenance", "Route Optimization"],
      impact: "25% fuel savings, 40% maintenance cost reduction",
      devices: "100M+ connected vehicles",
      roi: "18-month payback period"
    }
  ]

  const dataAnalyticsPipeline = [
    {
      stage: "Data Collection",
      technologies: ["Raspberry Pi Sensors", "Arduino", "ESP32"],
      throughput: "1M+ data points/second",
      description: "Real-time sensor data collection from edge devices"
    },
    {
      stage: "Edge Processing",
      technologies: ["TensorFlow Lite", "Edge Analytics", "Local Storage"],
      throughput: "100K events/second processed",
      description: "Local data processing and filtering at the edge"
    },
    {
      stage: "Cloud Analytics",
      technologies: ["Apache Kafka", "Spark Streaming", "Machine Learning"],
      throughput: "10TB data processed daily",
      description: "Advanced analytics and machine learning insights"
    },
    {
      stage: "Visualization",
      technologies: ["Grafana", "Power BI", "Custom Dashboards"],
      throughput: "Real-time dashboards",
      description: "Interactive data visualization and reporting"
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

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/solutions" className="text-purple-400 font-medium">Solutions</Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors">About</Link>
{isLearningHubEnabled() && (
                <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">Learning</Link>
              )}
              <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">Contact</Link>
            </nav>
          </div>

          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
              <div className="flex flex-col space-y-3">
                <Link href="/solutions" className="text-purple-400 font-medium">Solutions</Link>
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">About</Link>
  {isLearningHubEnabled() && (
                <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">Learning</Link>
              )}
                <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">Contact</Link>
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
                <div className="p-3 bg-cyan-500/20 rounded-lg text-cyan-300 backdrop-blur-sm">
                  <Shield className="h-8 w-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  IoT Integration
                </h1>
              </div>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Connect the physical and digital worlds with comprehensive IoT solutions.
                From sensor networks to cloud analytics, build scalable systems that
                enable real-time monitoring, control, and intelligent decision-making.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Badge className="bg-cyan-500/20 text-cyan-200 border-cyan-400/50">
                  Connectivity
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/50">
                  Data Analytics
                </Badge>
                <Badge className="bg-green-500/20 text-green-200 border-green-400/50">
                  Security
                </Badge>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-center">IoT Market Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {iotMarketMetrics.map((metric, index) => (
                      <div key={index} className="text-center p-4 bg-cyan-500/10 rounded-lg">
                        <metric.icon className="h-6 w-6 mx-auto mb-2 text-cyan-300" />
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

      {/* IoT Applications */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            IoT Applications & Use Cases
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {iotApplications.map((application, index) => (
              <Card key={index} className="bg-black/30 border-white/20 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <application.icon className="h-8 w-8 text-cyan-300" />
                    <CardTitle className="text-white">{application.title}</CardTitle>
                  </div>
                  <Badge className="w-fit bg-blue-500/20 text-blue-200 border-blue-400/50">
                    {application.sector}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{application.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">Impact:</span>
                    <span className="text-cyan-400 font-semibold">{application.impact}</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-400 block mb-2">Protocols:</span>
                    <div className="flex flex-wrap gap-1">
                      {application.protocols.map((protocol, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-cyan-400/50 text-cyan-200">
                          {protocol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block mb-2">Industry Examples:</span>
                    <div className="space-y-1">
                      {application.examples.map((example, idx) => (
                        <div key={idx} className="text-xs text-gray-300">• {example}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Connectivity Protocols Dashboard */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Communication Protocols & Performance
          </h2>

          <div className="space-y-6">
            {connectivityProtocols.map((protocol, index) => (
              <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{protocol.protocol}</h3>
                      <p className="text-gray-400 text-sm">{protocol.description}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Use Case</span>
                      <span className="text-gray-300 text-sm">{protocol.useCase}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Reliability</span>
                      <span className={`text-sm font-semibold ${
                        protocol.reliability === 'Very High' ? 'text-green-400' :
                        protocol.reliability === 'High' ? 'text-blue-400' :
                        'text-yellow-400'
                      }`}>
                        {protocol.reliability}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Latency</span>
                      <span className="text-cyan-300">{protocol.latency}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Power</span>
                      <span className="text-green-400">{protocol.powerConsumption}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Frameworks */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            IoT Security Architecture
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securityFrameworks.map((framework, index) => (
              <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="h-6 w-6 text-red-400" />
                    <CardTitle className="text-white">{framework.layer}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">Technologies:</span>
                      <div className="space-y-1">
                        {framework.technologies.map((tech, idx) => (
                          <div key={idx} className="text-cyan-300 text-sm">• {tech}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Threat Vector:</span>
                      <span className="text-red-300 text-sm">{framework.threats}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Mitigation:</span>
                      <span className="text-green-400 font-semibold">{framework.mitigation}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Use Cases */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Industry Impact & ROI Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {industryUseCases.map((useCase, index) => (
              <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">{useCase.industry}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">Applications:</span>
                      {useCase.applications.map((app, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span className="text-gray-300 text-sm">{app}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <span className="text-gray-400 text-sm">Impact:</span>
                        <div className="text-cyan-400 font-semibold">{useCase.impact}</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Connected Devices:</span>
                        <div className="text-blue-400">{useCase.devices}</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">ROI:</span>
                        <div className="text-green-400 font-semibold">{useCase.roi}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Analytics Pipeline */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Data Analytics Pipeline
          </h2>

          <div className="space-y-6">
            {dataAnalyticsPipeline.map((stage, index) => (
              <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{stage.stage}</h3>
                      <p className="text-gray-400 text-sm">{stage.description}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Technologies</span>
                      <div className="space-y-1">
                        {stage.technologies.map((tech, idx) => (
                          <div key={idx} className="text-cyan-300 text-sm">• {tech}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Throughput</span>
                      <span className="text-green-400 font-semibold">{stage.throughput}</span>
                    </div>
                    <div className="flex justify-center">
                      <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/50">
                        Stage {index + 1}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Career Opportunities */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            IoT Career Opportunities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerOpportunities.map((job, index) => (
              <Card key={index} className="bg-black/30 border-white/20 hover:border-cyan-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{job.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-cyan-300" />
                    <span className="text-cyan-300 font-semibold">{job.company}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm">{job.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Salary:</span>
                      <span className="text-green-400 font-semibold">{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{job.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">Key Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-cyan-400/50 text-cyan-200">
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

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Build the Connected Future with IoT
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the IoT revolution and create intelligent systems that connect the physical and digital worlds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3">
              Explore IoT Solutions
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3">
              Integration Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}