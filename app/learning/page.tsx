"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BeamsBackground } from "@/components/ui/beams-background"
import { EmailSignup } from "@/components/ui/email-signup"
import { LearningInterestForm } from "@/components/ui/learning-interest-form"
import { createLearningInterest } from "@/lib/actions/learning-interest"
import {
  Menu,
  X,
  BookOpen,
  Clock,
  Microscope as Microchip,
  Shield,
  Phone,
  Brain,
  BarChart3,
  Mail,
  Sparkles,
  Users,
  Zap,
  Star,
  Award,
  MessageSquare,
  GraduationCap,
  CheckCircle,
  Play,
  ArrowRight,
  Crown,
  Github,
  Code,
  Cpu,
  Bot,
  Database,
  Globe,
  TrendingUp,
  Target,
  Rocket
} from "lucide-react"
import Link from "next/link"

export default function LearningPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const freeCourses = [
    {
      id: 1,
      title: "AI Fundamentals",
      description: "Master the basics of artificial intelligence and machine learning",
      duration: "4 weeks",
      lessons: 12,
      students: 1247,
      rating: 4.8,
      icon: Brain,
      level: "Beginner",
      tags: ["AI", "Machine Learning", "Fundamentals"]
    },
    {
      id: 2,
      title: "Neural Networks Deep Dive",
      description: "Understand how neural networks work and build your own from scratch",
      duration: "3 weeks",
      lessons: 10,
      students: 892,
      rating: 4.9,
      icon: Cpu,
      level: "Intermediate",
      tags: ["Neural Networks", "Deep Learning", "Python"]
    },
    {
      id: 3,
      title: "Computer Vision Basics",
      description: "Learn image processing and computer vision techniques",
      duration: "3 weeks",
      lessons: 9,
      students: 634,
      rating: 4.7,
      icon: Globe,
      level: "Beginner",
      tags: ["Computer Vision", "OpenCV", "Image Processing"]
    },
    {
      id: 4,
      title: "Natural Language Processing",
      description: "Process and understand human language with AI",
      duration: "4 weeks",
      lessons: 14,
      students: 756,
      rating: 4.6,
      icon: MessageSquare,
      level: "Intermediate",
      tags: ["NLP", "Text Processing", "Transformers"]
    },
    {
      id: 5,
      title: "GitHub AI Agent Cloning",
      description: "Clone, customize, and deploy AI agents from open-source repositories",
      duration: "2 weeks",
      lessons: 8,
      students: 1523,
      rating: 4.9,
      icon: Github,
      level: "Beginner",
      tags: ["GitHub", "AI Agents", "Deployment"],
      featured: true
    }
  ]

  const premiumFeatures = [
    {
      icon: Crown,
      title: "Unlimited Course Access",
      description: "Access to all premium courses and advanced modules"
    },
    {
      icon: Users,
      title: "1-on-1 Mentorship with Lee Akpareva",
      description: "Monthly video calls to discuss your projects and career goals"
    },
    {
      icon: Bot,
      title: "Advanced AI Assignments",
      description: "Real-world projects graded by AI with detailed feedback"
    },
    {
      icon: Award,
      title: "Industry Certifications",
      description: "Verified certificates recognized by top tech companies"
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Track your learning progress with advanced insights"
    },
    {
      icon: MessageSquare,
      title: "Priority Forum Support",
      description: "Get priority help from instructors and community"
    }
  ]

  const stats = [
    { label: "Active Students", value: "5,000+", icon: Users },
    { label: "Courses Available", value: "25+", icon: BookOpen },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "Average Rating", value: "4.8/5", icon: Star }
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
              <Link href="/learning" className="text-purple-400 font-medium">
                Learning
              </Link>
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
                Agent Lee
              </Link>
              <Link href="/dashboard" className="text-white hover:text-purple-400 transition-colors">
                Dashboard
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
                <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                  About
                </Link>
                <Link href="/learning" className="text-purple-400 font-medium">
                  Learning
                </Link>
                <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-colors">
                  Agent Lee
                </Link>
                <Link href="/dashboard" className="text-white hover:text-purple-400 transition-colors">
                  Dashboard
                </Link>
                <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <BeamsBackground intensity="subtle" className="relative">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                NAVADA Learning Management System
              </h2>
              <p className="text-xl text-gray-100 max-w-3xl mx-auto mb-8">
                Master AI, robotics, and cutting-edge technology with our comprehensive learning platform.
                From beginner tutorials to advanced projects, we've got your learning journey covered.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <stat.icon className="h-6 w-6 text-purple-300" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg">
                  <Play className="h-5 w-5 mr-2" />
                  Start Learning Free
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-400 text-purple-300 hover:bg-purple-600 hover:text-white px-8 py-3 text-lg"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Free Courses Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Free AI Learning Modules</h3>
              <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                Start your AI journey with our comprehensive free courses. No credit card required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {freeCourses.map((course) => (
                <Card
                  key={course.id}
                  className={`bg-black/30 border-white/20 hover:border-purple-400/50 transition-all duration-300 cursor-pointer group ${
                    course.featured ? 'ring-2 ring-purple-400/50' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    {course.featured && (
                      <Badge className="bg-purple-600 text-white mb-2 w-fit">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <course.icon className="h-6 w-6 text-purple-300" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs text-purple-300 border-purple-400">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-white group-hover:text-purple-200 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white font-medium">{course.rating}</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300">FREE</Badge>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="outline"
                          className="text-xs text-gray-400 border-gray-600"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <Play className="h-4 w-4 mr-2" />
                      Start Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Features Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full text-white font-medium mb-4">
                <Crown className="h-5 w-5" />
                <span>Premium Plan</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Unlock Everything for £100/month
              </h3>
              <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                Get unlimited access to all courses, 1-on-1 mentorship with Lee Akpareva,
                and advanced features designed for serious learners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {premiumFeatures.map((feature, index) => (
                <Card key={index} className="bg-black/30 border-white/20 hover:border-yellow-400/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-yellow-500/20 rounded-xl">
                        <feature.icon className="h-8 w-8 text-yellow-300" />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 text-lg">
                <Crown className="h-5 w-5 mr-2" />
                Upgrade to Premium - £100/month
              </Button>
              <p className="text-sm text-gray-400 mt-3">
                Includes monthly 1-on-1 calls with Lee Akpareva • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Learning Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Complete Learning Experience
              </h3>
              <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                Our platform provides everything you need to master AI and robotics technology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-black/30 border-white/20 hover:border-cyan-400/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-xl">
                      <Target className="h-8 w-8 text-cyan-300" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Progress Tracking</h4>
                  <p className="text-gray-300 text-sm">
                    Monitor your learning journey with detailed progress analytics and completion certificates.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-white/20 hover:border-green-400/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <Bot className="h-8 w-8 text-green-300" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">AI-Powered Grading</h4>
                  <p className="text-gray-300 text-sm">
                    Submit assignments and get instant feedback from our advanced AI grading system.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-white/20 hover:border-pink-400/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-pink-500/20 rounded-xl">
                      <MessageSquare className="h-8 w-8 text-pink-300" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Community Forum</h4>
                  <p className="text-gray-300 text-sm">
                    Connect with fellow learners, ask questions, and share your projects.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-white/20 hover:border-purple-400/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <Award className="h-8 w-8 text-purple-300" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Digital Certificates</h4>
                  <p className="text-gray-300 text-sm">
                    Earn verified certificates and digital badges to showcase your achievements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your AI Journey?
              </h3>
              <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-8">
                Join thousands of students already learning AI and robotics with NAVADA.
                Start with our free courses today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg">
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Learning Now
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-8 py-3 text-lg"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Get Updates
                </Button>
              </div>

              {/* Email Signup */}
              <div className="max-w-md mx-auto">
                <EmailSignup />
              </div>
            </div>
          </div>
        </section>
      </BeamsBackground>

      {/* Bottom Navigation for Mobile */}
      <nav className="bg-black/95 backdrop-blur border-t border-gray-800 md:hidden">
        <div className="flex justify-around py-2">
          <Link href="/solutions" className="flex flex-col items-center py-2 px-3 text-xs">
            <Microchip className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Research</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center py-2 px-3 text-xs">
            <Shield className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">About</span>
          </Link>
          <Link href="/learning" className="flex flex-col items-center py-2 px-3 text-xs">
            <BookOpen className="h-5 w-5 text-purple-400 mb-1" />
            <span className="text-purple-400">Learning</span>
          </Link>
          <Link href="/agent-lee" className="flex flex-col items-center py-2 px-3 text-xs">
            <Brain className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-gray-400">Agent Lee</span>
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