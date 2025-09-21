"use client"

import { useState } from "react"
import Link from "next/link"
import { isLearningHubEnabled } from "@/lib/feature-flags"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BeamsBackground } from "@/components/ui/beams-background"
import {
  Zap,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Menu,
  X,
  GraduationCap,
  BookOpen,
  Trophy,
  Target,
  CheckCircle,
  MapPin,
  Briefcase,
  School,
  Lightbulb,
  Code,
  Wrench,
  Award,
  Calendar,
  Clock,
  Star
} from "lucide-react"

export default function EducationalRoboticsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const educationMetrics = [
    { label: "STEM Market", value: "£47B", growth: "+28% by 2027", icon: DollarSign },
    { label: "Job Growth", value: "35%", growth: "robotics education", icon: TrendingUp },
    { label: "Universities", value: "2,500+", growth: "robotics programs", icon: School },
    { label: "Avg Salary", value: "£88K", growth: "education tech", icon: Users }
  ]

  const educationalPrograms = [
    {
      title: "University Research Programs",
      description: "Comprehensive robotics curriculum for undergraduate and graduate students with hands-on research projects.",
      level: "Higher Education",
      impact: "500+ students trained",
      icon: GraduationCap,
      features: ["Research Projects", "PhD Supervision", "Industry Partnerships"],
      institutions: ["MIT", "Stanford", "CMU", "Georgia Tech"]
    },
    {
      title: "K-12 STEM Integration",
      description: "Age-appropriate robotics kits and curricula designed to introduce programming and engineering concepts.",
      level: "K-12 Education",
      impact: "10,000+ students reached",
      icon: School,
      features: ["Curriculum Design", "Teacher Training", "Competition Support"],
      institutions: ["FIRST Robotics", "VEX Robotics", "LEGO Education"]
    },
    {
      title: "Professional Development",
      description: "Industry training programs for engineers and technicians to upskill in robotics and automation.",
      level: "Professional Training",
      impact: "2,000+ professionals certified",
      icon: Trophy,
      features: ["Certification Programs", "Hands-on Workshops", "Career Placement"],
      institutions: ["Coursera", "edX", "LinkedIn Learning"]
    }
  ]

  const curriculumModules = [
    {
      module: "Fundamentals of Robotics",
      duration: "4 weeks",
      topics: ["Robot Components", "Sensors & Actuators", "Control Systems"],
      projects: "Build Basic Mobile Robot",
      difficulty: "Beginner"
    },
    {
      module: "Programming & Control",
      duration: "6 weeks",
      topics: ["Python/C++ Programming", "ROS Framework", "Algorithm Design"],
      projects: "Autonomous Navigation System",
      difficulty: "Intermediate"
    },
    {
      module: "Computer Vision",
      duration: "8 weeks",
      topics: ["Image Processing", "Object Detection", "Machine Learning"],
      projects: "Vision-Guided Robot Arm",
      difficulty: "Advanced"
    },
    {
      module: "AI & Machine Learning",
      duration: "10 weeks",
      topics: ["Neural Networks", "Reinforcement Learning", "Edge Computing"],
      projects: "Intelligent Autonomous Robot",
      difficulty: "Expert"
    }
  ]

  const careerOpportunities = [
    {
      title: "Robotics Education Specialist",
      company: "LEGO Education",
      salary: "£75,000 - £105,000",
      location: "Billund, Denmark",
      type: "Full-time",
      skills: ["Curriculum Development", "Educational Technology", "STEM Teaching"],
      description: "Design and implement robotics curricula for K-12 education worldwide"
    },
    {
      title: "University Robotics Professor",
      company: "Carnegie Mellon University",
      salary: "£95,000 - £180,000",
      location: "Pittsburgh, PA",
      type: "Tenure Track",
      skills: ["PhD in Robotics", "Research Publications", "Grant Writing"],
      description: "Lead research and teach graduate-level robotics courses"
    },
    {
      title: "Training Program Manager",
      company: "ABB Robotics",
      salary: "£85,000 - £125,000",
      location: "Auburn Hills, MI",
      type: "Full-time",
      skills: ["Industrial Robotics", "Training Design", "Project Management"],
      description: "Develop and deliver industrial robotics training programs"
    },
    {
      title: "EdTech Product Manager",
      company: "Sphero",
      salary: "£90,000 - £140,000",
      location: "Boulder, CO",
      type: "Full-time",
      skills: ["Product Management", "Educational Technology", "Market Research"],
      description: "Lead development of educational robotics products and platforms"
    }
  ]

  const learningOutcomes = [
    {
      category: "Technical Skills",
      skills: [
        "Robot Programming (Python, C++)",
        "Hardware Integration (Sensors, Motors)",
        "Control System Design",
        "Computer Vision & AI",
        "3D Modeling & Printing"
      ]
    },
    {
      category: "Soft Skills",
      skills: [
        "Problem-Solving",
        "Critical Thinking",
        "Team Collaboration",
        "Project Management",
        "Creative Design"
      ]
    },
    {
      category: "Career Preparation",
      skills: [
        "Industry Knowledge",
        "Portfolio Development",
        "Professional Networking",
        "Research Methodology",
        "Technical Communication"
      ]
    }
  ]

  const industryPartnerships = [
    {
      company: "Boston Dynamics",
      partnership: "Research Collaboration",
      programs: ["Advanced Robotics Research", "Student Internships"],
      impact: "15 students placed annually"
    },
    {
      company: "Tesla",
      partnership: "Curriculum Advisor",
      programs: ["Autonomous Vehicle Tech", "Manufacturing Automation"],
      impact: "Custom curriculum development"
    },
    {
      company: "NVIDIA",
      partnership: "Technology Provider",
      programs: ["AI Hardware Grants", "Technical Training"],
      impact: "£500K in equipment donated"
    }
  ]

  const competitionPrograms = [
    {
      name: "FIRST Robotics Competition",
      level: "High School",
      participants: "40,000+ students",
      focus: "Engineering Design Process",
      awards: "£80M+ in scholarships"
    },
    {
      name: "RoboCup",
      level: "University",
      participants: "4,000+ teams globally",
      focus: "AI & Autonomous Systems",
      awards: "International recognition"
    },
    {
      name: "VEX Robotics World Championship",
      level: "K-12 & University",
      participants: "30,000+ students",
      focus: "Programming & Engineering",
      awards: "Scholarships & internships"
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
              <Link href="/learning" className="text-white hover:text-purple-400 transition-colors">Learning</Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">Contact</Link>
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
                <div className="p-3 bg-orange-500/20 rounded-lg text-orange-300 backdrop-blur-sm">
                  <Zap className="h-8 w-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Educational Robotics
                </h1>
              </div>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Transform education with comprehensive robotics programs. From K-12 STEM initiatives
                to university research and professional development, build the next generation of
                robotics engineers and innovators.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Badge className="bg-orange-500/20 text-orange-200 border-orange-400/50">
                  STEM Education
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/50">
                  Curriculum Design
                </Badge>
                <Badge className="bg-green-500/20 text-green-200 border-green-400/50">
                  Career Development
                </Badge>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-center">Education Market</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {educationMetrics.map((metric, index) => (
                      <div key={index} className="text-center p-4 bg-orange-500/10 rounded-lg">
                        <metric.icon className="h-6 w-6 mx-auto mb-2 text-orange-300" />
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

      {/* Educational Programs */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Educational Programs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {educationalPrograms.map((program, index) => (
              <Card key={index} className="bg-black/30 border-white/20 hover:border-orange-400/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <program.icon className="h-8 w-8 text-orange-300" />
                    <CardTitle className="text-white">{program.title}</CardTitle>
                  </div>
                  <Badge className="w-fit bg-blue-500/20 text-blue-200 border-blue-400/50">
                    {program.level}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{program.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">Impact:</span>
                    <span className="text-orange-400 font-semibold">{program.impact}</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-400 block mb-2">Features:</span>
                    <div className="flex flex-wrap gap-1">
                      {program.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-orange-400/50 text-orange-200">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block mb-2">Partner Institutions:</span>
                    <div className="space-y-1">
                      {program.institutions.map((institution, idx) => (
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

      {/* Curriculum Modules */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Curriculum Structure
          </h2>

          <div className="space-y-6">
            {curriculumModules.map((module, index) => (
              <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{module.module}</h3>
                      <Badge className={`mt-2 w-fit ${
                        module.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-200 border-green-400/50' :
                        module.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/50' :
                        module.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-200 border-orange-400/50' :
                        'bg-red-500/20 text-red-200 border-red-400/50'
                      }`}>
                        {module.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Duration</span>
                      <span className="text-gray-300">{module.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Key Topics</span>
                      <div className="space-y-1">
                        {module.topics.map((topic, idx) => (
                          <div key={idx} className="text-gray-300 text-sm">• {topic}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block">Capstone Project</span>
                      <span className="text-orange-300">{module.projects}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Outcomes Dashboard */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Learning Outcomes & Skills Development
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningOutcomes.map((outcome, index) => (
              <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-center">{outcome.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {outcome.skills.map((skill, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Programs */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Robotics Competitions & Championships
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {competitionPrograms.map((competition, index) => (
              <Card key={index} className="bg-black/30 border-white/20 hover:border-orange-400/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="h-6 w-6 text-orange-300" />
                    <CardTitle className="text-white">{competition.name}</CardTitle>
                  </div>
                  <Badge className="w-fit bg-purple-500/20 text-purple-200 border-purple-400/50">
                    {competition.level}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Participants:</span>
                      <span className="text-orange-300">{competition.participants}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Focus Area:</span>
                      <span className="text-gray-300">{competition.focus}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Awards:</span>
                      <span className="text-green-400">{competition.awards}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Career Opportunities */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Educational Robotics Careers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerOpportunities.map((job, index) => (
              <Card key={index} className="bg-black/30 border-white/20 hover:border-orange-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{job.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-orange-300" />
                    <span className="text-orange-300 font-semibold">{job.company}</span>
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
                          <Badge key={idx} variant="outline" className="text-xs border-orange-400/50 text-orange-200">
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

      {/* Industry Partnerships */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Industry Partnerships
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industryPartnerships.map((partnership, index) => (
              <Card key={index} className="bg-black/30 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">{partnership.company}</CardTitle>
                  <Badge className="w-fit bg-blue-500/20 text-blue-200 border-blue-400/50">
                    {partnership.partnership}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">Programs:</span>
                      {partnership.programs.map((program, idx) => (
                        <div key={idx} className="text-gray-300 text-sm">• {program}</div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Impact:</span>
                      <span className="text-orange-400 font-semibold">{partnership.impact}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-900/20 to-purple-900/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Shape the Future of Robotics Education
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join educators, researchers, and industry leaders in building comprehensive robotics education programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
              Explore Curriculum
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3">
              Partnership Inquiry
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}