"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { BeamsBackground } from "@/components/ui/beams-background"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  BookOpen,
  Users,
  Star,
  Clock,
  Shield,
  ArrowLeft,
  Settings,
  Play,
  CheckCircle,
  Sparkles,
  Bot,
  Wand2
} from "lucide-react"
import Link from "next/link"

interface Course {
  id: number
  title: string
  description: string
  detailedDescription: string
  duration: string
  lessons: number
  students: number
  rating: number
  level: string
  tags: string[]
  featured: boolean
  learningOutcomes: string[]
  courseModules: { title: string; lessons: number; duration: string }[]
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with the current courses
  useEffect(() => {
    const initialCourses: Course[] = [
      {
        id: 1,
        title: "AI Fundamentals & Machine Learning",
        description: "Master the complete foundation of artificial intelligence and machine learning from theory to practical applications",
        detailedDescription: "This comprehensive course covers everything from basic AI concepts to advanced machine learning algorithms. You'll learn linear regression, decision trees, neural networks, and how to implement them in Python. Includes hands-on projects with real datasets.",
        duration: "6 weeks",
        lessons: 24,
        students: 2847,
        rating: 4.9,
        level: "Beginner",
        tags: ["AI", "Machine Learning", "Python", "Theory"],
        featured: true,
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
        detailedDescription: "Dive deep into computer vision techniques from basic image processing to advanced deep learning models. Build real applications like face detection, object recognition, and image classification systems.",
        duration: "5 weeks",
        lessons: 20,
        students: 1634,
        rating: 4.8,
        level: "Intermediate",
        tags: ["Computer Vision", "OpenCV", "Deep Learning", "Image Processing"],
        featured: false,
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
        detailedDescription: "Learn to create sophisticated AI agents that can interact with users, process natural language, and integrate with various APIs. From concept to deployment, master the complete AI agent development lifecycle.",
        duration: "4 weeks",
        lessons: 16,
        students: 2156,
        rating: 4.9,
        level: "Advanced",
        tags: ["AI Agents", "Development", "Deployment", "APIs"],
        featured: false,
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
    setCourses(initialCourses)
  }, [])

  const handleSave = async (course: Course) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (course.id) {
      // Update existing course
      setCourses(prev => prev.map(c => c.id === course.id ? course : c))
    } else {
      // Create new course
      const newCourse = { ...course, id: Date.now() }
      setCourses(prev => [...prev, newCourse])
    }

    setEditingCourse(null)
    setShowCreateForm(false)
    setIsLoading(false)
  }

  const handleDelete = async (courseId: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setCourses(prev => prev.filter(c => c.id !== courseId))
      setIsLoading(false)
    }
  }

  const CourseForm = ({ course, onSave, onCancel }: {
    course: Course | null,
    onSave: (course: Course) => void,
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<Course>(course || {
      id: 0,
      title: "",
      description: "",
      detailedDescription: "",
      duration: "",
      lessons: 0,
      students: 0,
      rating: 0,
      level: "Beginner",
      tags: [],
      featured: false,
      learningOutcomes: [],
      courseModules: []
    })
    const [isEnhancing, setIsEnhancing] = useState(false)

    const handleAIEnhancement = async () => {
      if (!formData.title || !formData.description) {
        alert("Please enter a course title and description first")
        return
      }

      setIsEnhancing(true)
      try {
        const response = await fetch('/api/learning/enhance-course', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseTitle: formData.title,
            courseDescription: formData.description,
            level: formData.level
          })
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            const enhanced = result.data
            setFormData(prev => ({
              ...prev,
              detailedDescription: enhanced.enhancedDescription || prev.detailedDescription,
              learningOutcomes: enhanced.learningOutcomes || prev.learningOutcomes,
              courseModules: enhanced.courseModules || prev.courseModules,
              tags: enhanced.technologies ? [...prev.tags, ...enhanced.technologies.slice(0, 4)] : prev.tags
            }))
          }
        }
      } catch (error) {
        console.error('Error enhancing course:', error)
        alert('Failed to enhance course content')
      } finally {
        setIsEnhancing(false)
      }
    }

    return (
      <Card className="bg-gray-900/95 border-gray-700/50 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">
                {course ? "Edit Course" : "Create New Course"}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {course ? "Update course information" : "Add a new course to the learning platform"}
              </CardDescription>
            </div>
            <Button
              onClick={handleAIEnhancement}
              disabled={isEnhancing || !formData.title || !formData.description}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isEnhancing ? (
                <>
                  <Bot className="h-4 w-4 mr-2 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Enhance
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-purple-300 block mb-1">Course Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter course title"
                className="bg-black/30 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-purple-300 block mb-1">Duration</label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 6 weeks"
                className="bg-black/30 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-purple-300 block mb-1">Short Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief course description"
              className="bg-black/30 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-purple-300 block mb-1">Detailed Description</label>
            <Textarea
              value={formData.detailedDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, detailedDescription: e.target.value }))}
              placeholder="Comprehensive course description"
              className="bg-black/30 border-gray-600 text-white placeholder-gray-400 min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-purple-300 block mb-1">Lessons</label>
              <Input
                type="number"
                value={formData.lessons}
                onChange={(e) => setFormData(prev => ({ ...prev, lessons: parseInt(e.target.value) || 0 }))}
                className="bg-black/30 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-purple-300 block mb-1">Students</label>
              <Input
                type="number"
                value={formData.students}
                onChange={(e) => setFormData(prev => ({ ...prev, students: parseInt(e.target.value) || 0 }))}
                className="bg-black/30 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-purple-300 block mb-1">Rating</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                className="bg-black/30 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-purple-300 block mb-1">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                className="w-full p-2 bg-black/30 border border-gray-600 rounded text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="text-purple-500"
              />
              <span className="text-white">Featured Course</span>
            </label>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => onSave(formData)}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Course"}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/learning" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Learning</span>
              </Link>
              <div className="h-6 w-px bg-gray-600"></div>
              <h1 className="text-2xl font-bold text-white">Course Administration</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
              <Button className="bg-gray-700 hover:bg-gray-600">
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </header>

      <BeamsBackground intensity="subtle" className="py-16 px-4">
        <div className="container mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900/95 border-gray-700/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <BookOpen className="h-6 w-6 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Courses</p>
                    <p className="text-2xl font-bold text-white">{courses.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/95 border-gray-700/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Users className="h-6 w-6 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Students</p>
                    <p className="text-2xl font-bold text-white">
                      {courses.reduce((sum, course) => sum + course.students, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/95 border-gray-700/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Star className="h-6 w-6 text-green-300" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Avg Rating</p>
                    <p className="text-2xl font-bold text-white">
                      {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/95 border-gray-700/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Lessons</p>
                    <p className="text-2xl font-bold text-white">
                      {courses.reduce((sum, course) => sum + course.lessons, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create/Edit Form */}
          {(showCreateForm || editingCourse) && (
            <div className="mb-8">
              <CourseForm
                course={editingCourse}
                onSave={handleSave}
                onCancel={() => {
                  setEditingCourse(null)
                  setShowCreateForm(false)
                }}
              />
            </div>
          )}

          {/* Courses List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Course Management</h2>

            <div className="grid gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="bg-gray-900/95 border-gray-700/50 hover:border-purple-400/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                          {course.featured && (
                            <Badge className="bg-purple-600 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <Badge className="bg-gray-700 text-gray-300">{course.level}</Badge>
                        </div>

                        <p className="text-gray-300 mb-3">{course.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400 mb-4">
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
                            <span>{course.students} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span>{course.rating}/5</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {course.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="outline"
                              className="text-xs text-purple-300 border-purple-500/40"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCourse(course)}
                          className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                          title="Preview Course"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </BeamsBackground>
    </div>
  )
}