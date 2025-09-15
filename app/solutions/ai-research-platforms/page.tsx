"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BeamsBackground } from "@/components/ui/beams-background"
import {
  Cpu,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Menu,
  X,
  Brain,
  Eye,
  Zap,
  BarChart3,
  CheckCircle,
  MapPin,
  Briefcase,
  Target,
  Layers,
  Database,
  Cloud,
  Monitor,
  Activity
} from "lucide-react"

export default function AIResearchPlatformsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const aiMarketMetrics = [
    { label: "AI Market Size", value: "£390B", growth: "+37.3%", icon: DollarSign },
    { label: "Edge AI Growth", value: "42%", growth: "CAGR 2023-30", icon: TrendingUp },
    { label: "AI Engineers", value: "£165K", growth: "avg salary", icon: Users },
    { label: "Research Labs", value: "12K+", growth: "worldwide", icon: Building }
  ]

  const researchApplications = [
    {
      title: "Computer Vision Research",
      description: "Real-time object detection, facial recognition, and autonomous navigation using TensorFlow Lite and OpenCV on edge devices.",
      field: "Computer Vision",
      impact: "60% faster inference",
      icon: Eye,
      technologies: ["TensorFlow Lite", "OpenCV", "YOLO", "MobileNet"],
      institutions: ["MIT CSAIL", "Stanford AI Lab", "DeepMind"]
    },
    {
      title: "Neural Network Optimization",
      description: "Edge computing research for deploying large language models and transformer networks on resource-constrained devices.",
      field: "Deep Learning",
      impact: "85% memory reduction",
      icon: Brain,
      technologies: ["PyTorch Mobile", "ONNX", "TensorRT", "Quantization"],
      institutions: ["Google AI", "Facebook AI", "OpenAI"]
    },
    {
      title: "Federated Learning Systems",
      description: "Distributed machine learning research enabling privacy-preserving collaborative training across multiple edge devices.",
      field: "Distributed AI",
      impact: "95% privacy retention",
      icon: Layers,
      technologies: ["PySyft", "TensorFlow Federated", "FedML", "Flower"],
      institutions: ["Berkeley AI", "CMU ML", "ETH Zurich"]
    }
  ]

  const industryBenchmarks = [
    {
      metric: "Training Speed",
      traditional: "Cloud-based: 24 hours",
      edge: "Edge Cluster: 6 hours",
      improvement: "75% faster",
      icon: Zap
    },
    {
      metric: "Inference Latency",
      traditional: "Cloud API: 200ms",
      edge: "Local Edge: 15ms",
      improvement: "93% reduction",
      icon: Activity
    },
    {
      metric: "Data Privacy",
      traditional: "Cloud: Data uploaded",
      edge: "Edge: Data stays local",
      improvement: "100% private",
      icon: CheckCircle
    },
    {
      metric: "Cost Efficiency",
      traditional: "Cloud: £0.50/hr/model",
      edge: "Edge: £0.05/hr/model",
      improvement: "90% savings",
      icon: DollarSign
    }
  ]

  const careerPaths = [
    {
      title: "AI Research Scientist",
      company: "Google DeepMind",
      salary: "£200,000 - £350,000",
      location: "Mountain View, CA",
      type: "Full-time",
      skills: ["Deep Learning", "TensorFlow", "Research Publications", "Edge Computing"],
      requirements: "PhD in CS/ML with 3+ years research experience"
    },
    {
      title: "Edge AI Engineer",
      company: "NVIDIA",
      salary: "£150,000 - £220,000",
      location: "Santa Clara, CA",
      type: "Full-time",
      skills: ["CUDA", "TensorRT", "Computer Vision", "Embedded Systems"],
      requirements: "MS in Engineering with edge computing experience"
    },
    {
      title: "ML Platform Engineer",
      company: "Apple",
      salary: "£180,000 - £280,000",
      location: "Cupertino, CA",
      type: "Full-time",
      skills: ["Core ML", "iOS/macOS", "Model Optimization", "Privacy-ML"],
      requirements: "BS/MS with 5+ years ML infrastructure experience"
    },
    {
      title: "Research Engineer - Federated Learning",
      company: "Meta AI",
      salary: "£170,000 - £250,000",
      location: "Menlo Park, CA",
      type: "Full-time",
      skills: ["PyTorch", "Distributed Systems", "Privacy Tech", "Federated Learning"],
      requirements: "MS/PhD with distributed ML research background"
    }
  ]

  const researchDatasets = [
    {
      name: "ImageNet",
      description: "14M labeled images for computer vision research",
      size: "150GB",
      applications: "Object Classification, Transfer Learning",
      access: "Academic License"
    },
    {
      name: "COCO Dataset",
      description: "Object detection and segmentation benchmark",
      size: "25GB",
      applications: "Object Detection, Instance Segmentation",
      access: "Open Source"
    },
    {
      name: "OpenAI GPT Models",
      description: "Pre-trained language models for NLP research",
      size: "Various",
      applications: "Text Generation, Question Answering",
      access: "API + Research License"
    }
  ]

  const platformSpecs = [
    {
      platform: "Raspberry Pi Cluster (8 nodes)",
      computation: "32 ARM Cortex-A76 cores, 64GB total RAM",
      performance: "~200 GFLOPS collective performance",
      specialization: "Distributed training, federated learning experiments"
    },
    {
      platform: "NVIDIA Jetson Xavier NX",
      computation: "6-core NVIDIA Carmel ARM CPU + 384-core Volta GPU",
      performance: "21 TOPS AI performance",
      specialization: "Computer vision, real-time inference"
    },
    {
      platform: "Google Coral Dev Board",
      computation: "Quad-core ARM CPU + Edge TPU",
      performance: "4 TOPS ML acceleration",
      specialization: "Neural network inference, mobile AI"
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

          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
              <div className="flex flex-col space-y-3">
                <Link href="/solutions" className="text-purple-400 font-medium">Solutions</Link>
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">About</Link>
                <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">Learning</Link>
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
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-300 backdrop-blur-sm">
                  <Cpu className="h-8 w-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  AI Research Platforms
                </h1>
              </div>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Accelerate AI research with edge computing platforms. Deploy machine learning models,
                conduct distributed training, and pioneer the next generation of intelligent systems
                using cutting-edge hardware and frameworks.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/50">
                  Edge AI
                </Badge>
                <Badge className="bg-green-500/20 text-green-200 border-green-400/50">
                  Neural Networks
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/50">
                  Distributed Learning
                </Badge>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-center">AI Research Market</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {aiMarketMetrics.map((metric, index) => (
                      <div key={index} className="text-center p-4 bg-blue-500/10 rounded-lg">
                        <metric.icon className="h-6 w-6 mx-auto mb-2 text-blue-300" />
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

      {/* Research Applications */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Research Applications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {researchApplications.map((application, index) => (
              <Card key={index} className="bg-black/30 border-white/20 hover:border-blue-400/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <application.icon className="h-8 w-8 text-blue-300" />
                    <CardTitle className="text-white">{application.title}</CardTitle>
                  </div>
                  <Badge className="w-fit bg-green-500/20 text-green-200 border-green-400/50">
                    {application.field}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{application.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">Impact:</span>
                    <span className="text-blue-400 font-semibold">{application.impact}</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-400 block mb-2">Technologies:</span>
                    <div className="flex flex-wrap gap-1">
                      {application.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-blue-400/50 text-blue-200">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block mb-2">Leading Institutions:</span>
                    <div className="space-y-1">
                      {application.institutions.map((institution, idx) => (
                        <div key={idx} className="text-xs text-gray-300">• {institution}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Benchmarks */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Edge vs Cloud Performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industryBenchmarks.map((benchmark, index) => (
              <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <benchmark.icon className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                  <CardTitle className="text-white text-lg">{benchmark.metric}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400">Traditional Cloud</div>
                    <div className="text-gray-300">{benchmark.traditional}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Edge Computing</div>
                    <div className="text-blue-300">{benchmark.edge}</div>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-green-500/20 text-green-200 border-green-400/50">
                      {benchmark.improvement}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Research Datasets Dashboard */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Research Datasets & Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchDatasets.map((dataset, index) => (
              <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">{dataset.name}</CardTitle>
                  <Badge className="w-fit bg-purple-500/20 text-purple-200 border-purple-400/50">
                    {dataset.access}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{dataset.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Size:</span>
                      <span className="text-blue-300">{dataset.size}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Applications:</span>
                      <span className="text-gray-300 text-sm">{dataset.applications}</span>
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
            AI Research Careers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerPaths.map((job, index) => (
              <Card key={index} className="bg-black/30 border-white/20 hover:border-blue-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{job.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-blue-300" />
                    <span className="text-blue-300 font-semibold">{job.company}</span>
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
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">Key Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-blue-400/50 text-blue-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Requirements:</span>
                      <p className="text-gray-300 text-sm mt-1">{job.requirements}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Specifications */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Research Platform Specifications
          </h2>

          <div className="space-y-6">
            {platformSpecs.map((spec, index) => (
              <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{spec.platform}</h3>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Computation</span>
                      <span className="text-gray-300">{spec.computation}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Performance</span>
                      <span className="text-blue-400">{spec.performance}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Specialization</span>
                      <span className="text-green-300">{spec.specialization}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Advance AI Research with Edge Computing
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join leading researchers pushing the boundaries of artificial intelligence with innovative edge computing platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Research Collaboration
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3">
              Platform Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}