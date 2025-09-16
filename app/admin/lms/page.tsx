"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BeamsBackground } from "@/components/ui/beams-background"
import { BarChart3, Plus, Edit, Trash2, Eye, Users, BookOpen, MessageSquare, Award, Save, Star, Clock, DollarSign, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  shortDescription: string
  description: string
  duration: string
  difficulty: string
  category: string
  isFreeTier: boolean
  price?: number
  featured: boolean
  published: boolean
  thumbnailUrl?: string
  instructorId?: string
  createdAt: string
  updatedAt: string
  enrollmentCount?: number
  completionRate?: number
}



export default function LMSAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showCourseForm, setShowCourseForm] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: "1",
        title: "AI Fundamentals",
        shortDescription: "Learn the basics of artificial intelligence",
        description: "Comprehensive introduction to AI concepts, machine learning, and practical applications.",
        duration: "4 weeks",
        difficulty: "Beginner",
        category: "AI/ML",
        isFreeTier: true,
        featured: true,
        published: true,
        thumbnailUrl: "/ai-fundamentals.jpg",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
        enrollmentCount: 1247,
        completionRate: 78
      },
      {
        id: "2",
        title: "Advanced Machine Learning",
        shortDescription: "Deep dive into ML algorithms and techniques",
        description: "Advanced course covering neural networks, deep learning, and real-world ML applications.",
        duration: "8 weeks",
        difficulty: "Advanced",
        category: "AI/ML",
        isFreeTier: false,
        price: 299,
        featured: false,
        published: true,
        createdAt: "2024-02-01",
        updatedAt: "2024-02-05",
        enrollmentCount: 342,
        completionRate: 65
      },
      {
        id: "3",
        title: "GitHub AI Agent Cloning",
        shortDescription: "Learn to clone and customize AI agents from GitHub",
        description: "Step-by-step guide to cloning, modifying, and deploying AI agents from open-source repositories.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        category: "Development",
        isFreeTier: true,
        featured: true,
        published: true,
        createdAt: "2024-01-20",
        updatedAt: "2024-01-25",
        enrollmentCount: 892,
        completionRate: 85
      }
    ]

    setCourses(mockCourses)
  }, [])

  const stats = {
    totalCourses: courses.length,
    totalStudents: courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0),
    averageCompletion: Math.round(courses.reduce((sum, course) => sum + (course.completionRate || 0), 0) / courses.length),
    revenue: courses.reduce((sum, course) => sum + ((course.price || 0) * (course.enrollmentCount || 0)), 0)
  }

  const CourseForm = () => (
    <Card className="bg-black/30 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">
          {selectedCourse ? "Edit Course" : "Create New Course"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-purple-300">Course Title</label>
            <Input
              placeholder="Enter course title"
              className="bg-black/30 border-white/20 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-purple-300">Category</label>
            <Input
              placeholder="e.g., AI/ML, Development"
              className="bg-black/30 border-white/20 text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-purple-300">Short Description</label>
          <Input
            placeholder="Brief course description"
            className="bg-black/30 border-white/20 text-white"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-purple-300">Full Description</label>
          <Textarea
            placeholder="Detailed course description"
            className="bg-black/30 border-white/20 text-white min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-purple-300">Duration</label>
            <Input
              placeholder="e.g., 4 weeks"
              className="bg-black/30 border-white/20 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-purple-300">Difficulty</label>
            <select className="w-full p-2 bg-black/30 border border-white/20 rounded text-white">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-purple-300">Price (£)</label>
            <Input
              type="number"
              placeholder="0 for free"
              className="bg-black/30 border-white/20 text-white"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="text-purple-500" />
            <span className="text-white">Free Tier</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="text-purple-500" />
            <span className="text-white">Featured</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="text-purple-500" />
            <span className="text-white">Published</span>
          </label>
        </div>

        <div className="flex space-x-3">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4 mr-2" />
            Save Course
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowCourseForm(false)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-600"></div>
              <h1 className="text-2xl font-bold text-white">LMS Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </header>

      <BeamsBackground intensity="subtle" className="py-16 px-4">
        <div className="container mx-auto">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-black/30 border-white/20 hover:border-purple-400/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <BookOpen className="h-6 w-6 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Courses</p>
                    <p className="text-2xl font-bold text-white">{stats.totalCourses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-white/20 hover:border-cyan-400/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Users className="h-6 w-6 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Students</p>
                    <p className="text-2xl font-bold text-white">{stats.totalStudents.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-white/20 hover:border-green-400/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-green-300" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Avg Completion</p>
                    <p className="text-2xl font-bold text-white">{stats.averageCompletion}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-white/20 hover:border-yellow-400/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Revenue</p>
                    <p className="text-2xl font-bold text-white">£{stats.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-black/30 border border-white/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="courses" className="data-[state=active]:bg-purple-600">
                <BookOpen className="h-4 w-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="students" className="data-[state=active]:bg-purple-600">
                <Users className="h-4 w-4 mr-2" />
                Students
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="forum" className="data-[state=active]:bg-purple-600">
                <MessageSquare className="h-4 w-4 mr-2" />
                Forum
              </TabsTrigger>
              <TabsTrigger value="certificates" className="data-[state=active]:bg-purple-600">
                <Award className="h-4 w-4 mr-2" />
                Certificates
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Course Management</h2>
                <Button
                  onClick={() => setShowCourseForm(!showCourseForm)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </div>

              {showCourseForm && <CourseForm />}

              <div className="grid gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="bg-black/30 border-white/20 hover:border-purple-400/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                            {course.featured && (
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            )}
                            {course.isFreeTier && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                                Free
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              course.published
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-gray-500/20 text-gray-300'
                            }`}>
                              {course.published ? 'Published' : 'Draft'}
                            </span>
                          </div>

                          <p className="text-gray-300 mb-3">{course.shortDescription}</p>

                          <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{course.enrollmentCount} students</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BarChart3 className="h-4 w-4" />
                              <span>{course.completionRate}% completion</span>
                            </div>
                            {course.price && (
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span>£{course.price}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCourse(course)}
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Other tabs content */}
            <TabsContent value="overview">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-4">LMS Overview</h2>
                <p className="text-gray-300">Comprehensive learning management system dashboard coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="students">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-4">Student Management</h2>
                <p className="text-gray-300">Student enrollment and progress tracking features coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-4">Learning Analytics</h2>
                <p className="text-gray-300">Advanced analytics and performance insights coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="forum">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-4">Forum Management</h2>
                <p className="text-gray-300">Student discussion board and Q&A management coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="certificates">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-4">Certificate Management</h2>
                <p className="text-gray-300">Digital badges and certification system coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </BeamsBackground>
    </div>
  )
}