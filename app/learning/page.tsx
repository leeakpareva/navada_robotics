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
  Code2,
  Cpu,
  Bot,
  Database,
  Globe,
  TrendingUp,
  Target,
  Rocket,
  Settings
} from "lucide-react"
import Link from "next/link"

export default function LearningPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const freeCourses = [
    {
      id: 1,
      title: "AI Fundamentals & Machine Learning",
      description: "Master the complete foundation of artificial intelligence and machine learning from theory to practical applications",
      duration: "6 weeks",
      lessons: 24,
      students: 2847,
      rating: 4.9,
      level: "Beginner",
      tags: ["AI", "Machine Learning", "Python", "Theory"],
      featured: true,
      detailedDescription: "This comprehensive course covers everything from basic AI concepts to advanced machine learning algorithms. You'll learn linear regression, decision trees, neural networks, and how to implement them in Python. Includes hands-on projects with real datasets.",
      learningOutcomes: [
        "Understand fundamental AI and ML concepts",
        "Build and train machine learning models",
        "Work with popular Python libraries (scikit-learn, pandas)",
        "Complete 5 real-world projects",
        "Prepare for advanced AI courses"
      ],
      courseModules: [
        { title: "Introduction to AI", lessons: 4, duration: "Week 1" },
        { title: "Machine Learning Basics", lessons: 4, duration: "Week 2" },
        { title: "Supervised Learning", lessons: 4, duration: "Week 3" },
        { title: "Unsupervised Learning", lessons: 4, duration: "Week 4" },
        { title: "Neural Networks", lessons: 4, duration: "Week 5" },
        { title: "Final Project", lessons: 4, duration: "Week 6" }
      ]
    },
    {
      id: 2,
      title: "Computer Vision & Image Processing",
      description: "Learn to build intelligent systems that can see and understand visual data using OpenCV and deep learning",
      duration: "5 weeks",
      lessons: 20,
      students: 1634,
      rating: 4.8,
      level: "Intermediate",
      tags: ["Computer Vision", "OpenCV", "Deep Learning", "Image Processing"],
      detailedDescription: "Dive deep into computer vision techniques from basic image processing to advanced deep learning models. Build real applications like face detection, object recognition, and image classification systems.",
      learningOutcomes: [
        "Master OpenCV for image processing",
        "Build object detection systems",
        "Implement facial recognition",
        "Create image classification models",
        "Deploy vision applications"
      ],
      courseModules: [
        { title: "OpenCV Fundamentals", lessons: 4, duration: "Week 1" },
        { title: "Image Processing Techniques", lessons: 4, duration: "Week 2" },
        { title: "Feature Detection", lessons: 4, duration: "Week 3" },
        { title: "Deep Learning for Vision", lessons: 4, duration: "Week 4" },
        { title: "Real-world Applications", lessons: 4, duration: "Week 5" }
      ]
    },
    {
      id: 3,
      title: "AI Agent Development & Deployment",
      description: "Build, customize, and deploy intelligent AI agents from scratch, including integration with modern frameworks",
      duration: "4 weeks",
      lessons: 16,
      students: 2156,
      rating: 4.9,
      level: "Advanced",
      tags: ["AI Agents", "Development", "Deployment", "APIs"],
      detailedDescription: "Learn to create sophisticated AI agents that can interact with users, process natural language, and integrate with various APIs. From concept to deployment, master the complete AI agent development lifecycle.",
      learningOutcomes: [
        "Design conversational AI agents",
        "Integrate with OpenAI and other APIs",
        "Deploy agents to cloud platforms",
        "Implement memory and context handling",
        "Build multi-modal agent capabilities"
      ],
      courseModules: [
        { title: "Agent Architecture", lessons: 4, duration: "Week 1" },
        { title: "Natural Language Processing", lessons: 4, duration: "Week 2" },
        { title: "API Integration & Tools", lessons: 4, duration: "Week 3" },
        { title: "Deployment & Scaling", lessons: 4, duration: "Week 4" }
      ]
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
              <Link href="/admin/courses" className="text-white hover:text-purple-400 transition-colors">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Admin
                </div>
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
                <Link href="/admin/courses" className="text-white hover:text-purple-400 transition-colors">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Admin
                  </div>
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
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">AI Learning Modules</h3>
              <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-6">
                Start your AI journey with our comprehensive courses, enhanced with Agent Lee integration for personalized learning.
              </p>
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-400/50">
                  <Bot className="h-4 w-4 text-purple-300" />
                  <span className="text-purple-300 text-sm font-medium">Agent Lee Integration</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full border border-green-400/50">
                  <Sparkles className="h-4 w-4 text-green-300" />
                  <span className="text-green-300 text-sm font-medium">AI-Powered Learning</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {freeCourses.map((course) => (
                <Card
                  key={course.id}
                  className={`bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-900/95 border-gray-700/50 hover:border-purple-400/70 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 cursor-pointer group hover:scale-[1.02] hover:-translate-y-1 backdrop-blur-sm ${
                    course.featured ? 'ring-2 ring-purple-400/60 shadow-lg shadow-purple-500/30' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    {course.featured && (
                      <Badge className="bg-purple-600 text-white mb-2 w-fit">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs text-purple-300 border-purple-400">
                        {course.level}
                      </Badge>
                      <Link href="/agent-lee" className="group/agent">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-purple-400 hover:text-white hover:bg-purple-600/20 group-hover/agent:scale-110 transition-all duration-200"
                          title="Ask Agent Lee about this course"
                        >
                          <Bot className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <CardTitle className="text-white group-hover:text-purple-200 transition-colors text-lg font-bold">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-gray-100 text-sm leading-relaxed mb-4">
                      {course.description}
                    </CardDescription>

                    {/* Course Modules Preview */}
                    <div className="mb-4">
                      <h4 className="text-purple-300 font-semibold text-sm mb-2">Course Modules:</h4>
                      <div className="space-y-1">
                        {course.courseModules.slice(0, 3).map((module, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-gray-200">{module.title}</span>
                            <span className="text-gray-400">{module.duration}</span>
                          </div>
                        ))}
                        {course.courseModules.length > 3 && (
                          <div className="text-xs text-purple-400">+{course.courseModules.length - 3} more modules</div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-300 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-200">{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-200">{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-200">{course.students}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white font-medium">{course.rating}</span>
                        <span className="text-gray-400 text-sm">({course.level})</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">FREE</Badge>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="outline"
                          className="text-xs text-purple-300 border-purple-500/40 bg-purple-500/10"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                        <Play className="h-4 w-4 mr-2" />
                        Start Course
                      </Button>
                      <Link href="/agent-lee">
                        <Button variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-600 hover:text-white" title="Get help from Agent Lee">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
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

        {/* AI-Powered Features Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-cyan-900/10 to-purple-900/10">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-purple-600 px-4 py-2 rounded-full text-white font-medium mb-4">
                <Sparkles className="h-5 w-5" />
                <span>AI-Enhanced Learning</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Personalized AI Learning Experience
              </h3>
              <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                Experience the future of education with Agent Lee and our AI-powered learning tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <Card className="bg-black/30 border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-xl">
                      <Bot className="h-8 w-8 text-cyan-300" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Agent Lee Tutor</h4>
                  <p className="text-gray-300 text-sm">
                    Get instant answers, explanations, and personalized guidance from Agent Lee throughout your learning journey.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <Zap className="h-8 w-8 text-purple-300" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Smart Recommendations</h4>
                  <p className="text-gray-300 text-sm">
                    AI analyzes your progress and suggests the next best courses and topics to accelerate your learning.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-white/20 hover:border-green-400/50 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <Target className="h-8 w-8 text-green-300" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Adaptive Learning Paths</h4>
                  <p className="text-gray-300 text-sm">
                    Course content adapts to your learning style and pace, ensuring optimal comprehension and retention.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-yellow-500/20 rounded-xl">
                      <BarChart3 className="h-8 w-8 text-yellow-300" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Intelligent Analytics</h4>
                  <p className="text-gray-300 text-sm">
                    Track your progress with AI-powered insights that identify strengths and areas for improvement.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-white/20 hover:border-pink-400/50 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-pink-500/20 rounded-xl">
                      <Code className="h-8 w-8 text-pink-300" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Code Review & Feedback</h4>
                  <p className="text-gray-300 text-sm">
                    Submit your code projects and receive detailed AI-powered feedback and suggestions for improvement.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-orange-500/20 rounded-xl">
                      <MessageSquare className="h-8 w-8 text-orange-300" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Interactive Q&A</h4>
                  <p className="text-gray-300 text-sm">
                    Ask questions anytime and get immediate, contextual answers powered by our AI knowledge base.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link href="/agent-lee">
                <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                  <Bot className="h-5 w-5 mr-2" />
                  Try Agent Lee Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Learning Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Complete Learning Platform
              </h3>
              <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                Everything you need to master AI and robotics in one comprehensive platform.
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
                  <h4 className="text-lg font-semibold text-white mb-2">Agent Lee Assistant</h4>
                  <p className="text-gray-300 text-sm">
                    Get personalized help and instant answers from Agent Lee, your AI learning companion.
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