"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { BeamsBackground } from "@/components/ui/beams-background"
import {
  BookOpen,
  Users,
  Star,
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Shield,
  ArrowLeft,
  Play,
  Sparkles,
  Bot,
  Wand2,
  BarChart3,
  DollarSign,
  TrendingUp,
  Award,
  FileText,
  Video,
  CheckCircle,
  Upload,
  File,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  shortDescription: string
  duration: string
  difficulty: string
  category: string
  isFreeTier: boolean
  prerequisites?: string
  learningOutcomes: string
  price?: number
  featured: boolean
  published: boolean
  lessons?: any[]
}

interface CourseModule {
  title: string
  description: string
  duration: string
  content: string
  orderIndex: number
  lessonType: string
}

export default function AdminCoursesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [generatingContent, setGeneratingContent] = useState(false)
  const [activeTab, setActiveTab] = useState("courses")
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    completionRate: 0,
    avgRating: 0
  })

  // Form states for new course
  const [newCourse, setNewCourse] = useState({
    title: "AI Fundamentals & Machine Learning",
    shortDescription: "",
    description: "",
    duration: "6 weeks",
    difficulty: "Beginner",
    category: "AI & Machine Learning",
    isFreeTier: true,
    prerequisites: "",
    learningOutcomes: "",
    price: 0,
    featured: false,
    published: false,
    videoUrl: ""
  })

  const [courseModules, setCourseModules] = useState<CourseModule[]>([])
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([])

  // Check if user is admin (Lee Akpareva)
  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.user?.email !== "leeakpareva@gmail.com") {
      toast.error("Access denied. Admin privileges required.")
      router.push("/")
      return
    }

    fetchCourses()
    fetchAnalytics()
  }, [session, status, router])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/learning/courses")
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast.error("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/learning/analytics")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  const generateCourseContent = async () => {
    if (!newCourse.title) {
      toast.error("Please enter a course title first")
      return
    }

    // Prepare document context if documents are uploaded
    let documentContext = ""
    if (uploadedDocuments.length > 0) {
      documentContext = `\n\nAdditional Context from uploaded documents:\n${uploadedDocuments.map(doc => `- ${doc.name} (${doc.type})`).join('\n')}`
    }

    setGeneratingContent(true)
    try {
      const response = await fetch("/api/learning/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newCourse.title,
          difficulty: newCourse.difficulty,
          duration: newCourse.duration,
          category: newCourse.category,
          isFreeTier: newCourse.isFreeTier,
          documentContext: documentContext
        })
      })

      if (!response.ok) throw new Error("Generation failed")

      const data = await response.json()

      // Update course details with generated content
      setNewCourse(prev => ({
        ...prev,
        description: data.description,
        shortDescription: data.shortDescription,
        learningOutcomes: data.learningOutcomes,
        prerequisites: data.prerequisites
      }))

      // Set generated modules
      setCourseModules(data.modules || [])

      toast.success("Course content generated successfully with Mistral AI!")
    } catch (error) {
      console.error("Error generating content:", error)
      toast.error("Failed to generate course content")
    } finally {
      setGeneratingContent(false)
    }
  }

  const saveCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      toast.error("Please fill in all required fields")
      return
    }

    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to save the course "${newCourse.title}"?\n\nThis will create a new course in the database with ${courseModules.length} modules.`
    )

    if (!confirmed) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/learning/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCourse,
          modules: courseModules
        })
      })

      if (!response.ok) throw new Error("Save failed")

      const data = await response.json()
      toast.success("Course saved successfully to database!")

      // Reset form and refresh courses
      setNewCourse({
        title: "",
        shortDescription: "",
        description: "",
        duration: "4 weeks",
        difficulty: "Beginner",
        category: "AI & Machine Learning",
        isFreeTier: true,
        prerequisites: "",
        learningOutcomes: "",
        price: 0,
        featured: false,
        published: false,
        videoUrl: ""
      })
      setCourseModules([])
      setUploadedDocuments([])
      fetchCourses()
      setActiveTab("courses")
    } catch (error) {
      console.error("Error saving course:", error)
      toast.error("Failed to save course")
    } finally {
      setLoading(false)
    }
  }

  const deleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return

    try {
      const response = await fetch(`/api/learning/courses/${courseId}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Delete failed")

      toast.success("Course deleted successfully")
      fetchCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
      toast.error("Failed to delete course")
    }
  }

  const togglePublishCourse = async (courseId: string, published: boolean) => {
    try {
      const response = await fetch(`/api/learning/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published })
      })

      if (!response.ok) throw new Error("Update failed")

      toast.success(`Course ${!published ? "published" : "unpublished"} successfully`)
      fetchCourses()
    } catch (error) {
      console.error("Error updating course:", error)
      toast.error("Failed to update course")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)
      // Limit to 5 files max, 10MB each
      const validFiles = fileArray.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 10MB)`)
          return false
        }
        return true
      }).slice(0, 5)

      setUploadedDocuments(prev => [...prev, ...validFiles].slice(0, 5))
      toast.success(`${validFiles.length} document(s) uploaded for context`)
    }
  }

  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index))
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (session?.user?.email !== "leeakpareva@gmail.com") {
    return null
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
            <div className="flex items-center space-x-4">
              <Badge className="bg-purple-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Admin: {session?.user?.name}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <BeamsBackground intensity="subtle" className="py-8 px-4">
        <div className="container mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900/95 border-gray-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Courses</p>
                    <p className="text-2xl font-bold text-white">{courses.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/95 border-gray-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Students</p>
                    <p className="text-2xl font-bold text-white">{analytics.totalStudents}</p>
                  </div>
                  <Users className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/95 border-gray-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Revenue</p>
                    <p className="text-2xl font-bold text-white">${analytics.totalRevenue}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/95 border-gray-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Completion Rate</p>
                    <p className="text-2xl font-bold text-white">{analytics.completionRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/95">
              <TabsTrigger value="courses">All Courses</TabsTrigger>
              <TabsTrigger value="create">Create with AI</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              <Card className="bg-gray-900/95 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Manage Courses</CardTitle>
                  <CardDescription className="text-gray-400">
                    View and manage all courses in the learning platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No courses found. Create your first course using Mistral AI!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <div key={course.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg text-white">{course.title}</h3>
                                {course.featured && (
                                  <Badge className="bg-purple-600 text-white">Featured</Badge>
                                )}
                                {course.published ? (
                                  <Badge className="bg-green-600 text-white">Published</Badge>
                                ) : (
                                  <Badge variant="secondary">Draft</Badge>
                                )}
                                <Badge variant="outline" className="text-gray-300">
                                  {course.isFreeTier ? "Free" : `$${course.price}`}
                                </Badge>
                              </div>
                              <p className="text-gray-400 text-sm mb-2">{course.shortDescription}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Duration: {course.duration}</span>
                                <span>Difficulty: {course.difficulty}</span>
                                <span>Category: {course.category}</span>
                                <span>Lessons: {course.lessons?.length || 0}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => togglePublishCourse(course.id, course.published)}
                                className="text-white border-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                              >
                                {course.published ? "Unpublish" : "Publish"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedCourse(course)}
                                className="text-white border-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteCourse(course.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card className="bg-gray-900/95 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="h-6 w-6 text-purple-400" />
                    Create Course with Mistral AI
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Use Mistral AI to generate comprehensive course content automatically
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">Course Title *</Label>
                      <Input
                        id="title"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., AI Fundamentals & Machine Learning"
                        className="bg-black/30 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="video-url" className="text-white">YouTube Video URL (Optional)</Label>
                      <Input
                        id="video-url"
                        value={newCourse.videoUrl || ''}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="bg-black/30 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white">Category</Label>
                      <Select
                        value={newCourse.category}
                        onValueChange={(value) => setNewCourse(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                          <SelectItem value="Computer Vision">Computer Vision</SelectItem>
                          <SelectItem value="Natural Language Processing">Natural Language Processing</SelectItem>
                          <SelectItem value="Robotics">Robotics</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Deep Learning">Deep Learning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-white">Difficulty Level</Label>
                      <Select
                        value={newCourse.difficulty}
                        onValueChange={(value) => setNewCourse(prev => ({ ...prev, difficulty: value }))}
                      >
                        <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-white">Duration</Label>
                      <Input
                        id="duration"
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 6 weeks"
                        className="bg-black/30 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-white">Price (USD)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newCourse.price}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        disabled={newCourse.isFreeTier}
                        className="bg-black/30 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="free-tier" className="text-white">Free Tier</Label>
                        <Switch
                          id="free-tier"
                          checked={newCourse.isFreeTier}
                          onCheckedChange={(checked) => setNewCourse(prev => ({
                            ...prev,
                            isFreeTier: checked,
                            price: checked ? 0 : prev.price
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="featured" className="text-white">Featured Course</Label>
                        <Switch
                          id="featured"
                          checked={newCourse.featured}
                          onCheckedChange={(checked) => setNewCourse(prev => ({ ...prev, featured: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="published" className="text-white">Publish Immediately</Label>
                        <Switch
                          id="published"
                          checked={newCourse.published}
                          onCheckedChange={(checked) => setNewCourse(prev => ({ ...prev, published: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short-description" className="text-white">Short Description</Label>
                    <Textarea
                      id="short-description"
                      value={newCourse.shortDescription}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, shortDescription: e.target.value }))}
                      placeholder="Brief description for course cards (max 150 characters)"
                      rows={2}
                      className="bg-black/30 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Full Description</Label>
                    <Textarea
                      id="description"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed course description (will be generated by AI)"
                      rows={4}
                      className="bg-black/30 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prerequisites" className="text-white">Prerequisites</Label>
                    <Textarea
                      id="prerequisites"
                      value={newCourse.prerequisites || ""}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, prerequisites: e.target.value }))}
                      placeholder="List any prerequisites (will be generated by AI)"
                      rows={2}
                      className="bg-black/30 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outcomes" className="text-white">Learning Outcomes</Label>
                    <Textarea
                      id="outcomes"
                      value={newCourse.learningOutcomes}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, learningOutcomes: e.target.value }))}
                      placeholder="What students will learn (will be generated by AI)"
                      rows={4}
                      className="bg-black/30 border-gray-600 text-white"
                    />
                  </div>

                  {/* Document Upload Section */}
                  <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-purple-400" />
                      <Label className="text-white font-medium">Upload Documents for Context (Optional)</Label>
                    </div>
                    <p className="text-sm text-gray-400">
                      Upload PDF documents, slides, or other course materials to help Mistral AI generate more accurate content.
                    </p>

                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-3">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.md"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <div className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                            <Upload className="h-4 w-4" />
                            <span>Choose Files</span>
                          </div>
                        </label>
                        <span className="text-sm text-gray-400">Max 5 files, 10MB each</span>
                      </div>

                      {uploadedDocuments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-white">Uploaded Documents:</h4>
                          {uploadedDocuments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded border border-gray-600">
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-blue-400" />
                                <span className="text-sm text-gray-300">{file.name}</span>
                                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(index)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={generateCourseContent}
                      disabled={generatingContent || !newCourse.title}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {generatingContent ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Generating with Mistral AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Content with Mistral AI
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={saveCourse}
                      disabled={loading || !newCourse.title || !newCourse.description}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Course to Database
                    </Button>
                  </div>

                  {courseModules.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        Generated Course Modules
                      </h3>
                      <div className="space-y-3">
                        {courseModules.map((module, idx) => (
                          <div key={idx} className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {module.lessonType === "video" ? (
                                  <Video className="h-4 w-4 text-purple-400" />
                                ) : (
                                  <FileText className="h-4 w-4 text-blue-400" />
                                )}
                                <h4 className="font-medium text-white">Module {idx + 1}: {module.title}</h4>
                              </div>
                              <Badge variant="outline" className="text-gray-300">{module.duration}</Badge>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{module.description}</p>
                            <details className="text-sm">
                              <summary className="cursor-pointer text-purple-400 hover:text-purple-300">
                                View content preview
                              </summary>
                              <div className="mt-2 p-3 bg-black/30 rounded border border-gray-700">
                                <pre className="whitespace-pre-wrap text-xs text-gray-300">
                                  {module.content.substring(0, 500)}...
                                </pre>
                              </div>
                            </details>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card className="bg-gray-900/95 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-cyan-400" />
                    Learning Analytics
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Track student progress and course performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-white font-medium">Course Performance</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Average Completion Rate</span>
                          <span className="text-white">{analytics.completionRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Average Rating</span>
                          <span className="text-white">{analytics.avgRating}/5.0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Enrollments</span>
                          <span className="text-white">{analytics.totalStudents}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-white font-medium">Revenue Metrics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Revenue</span>
                          <span className="text-white">£{analytics.totalRevenue}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Free Tier Users</span>
                          <span className="text-white">85%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Paid Tier Users</span>
                          <span className="text-white">15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Course Edit Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Edit className="h-6 w-6 text-purple-400" />
                    Edit Course: {selectedCourse.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCourse(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Update course information and content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title" className="text-white">Course Title</Label>
                    <Input
                      id="edit-title"
                      value={selectedCourse.title}
                      onChange={(e) => setSelectedCourse(prev => prev ? {...prev, title: e.target.value} : null)}
                      className="bg-black/30 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-difficulty" className="text-white">Difficulty</Label>
                    <Select
                      value={selectedCourse.difficulty}
                      onValueChange={(value) => setSelectedCourse(prev => prev ? {...prev, difficulty: value} : null)}
                    >
                      <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-duration" className="text-white">Duration</Label>
                    <Input
                      id="edit-duration"
                      value={selectedCourse.duration}
                      onChange={(e) => setSelectedCourse(prev => prev ? {...prev, duration: e.target.value} : null)}
                      className="bg-black/30 border-gray-600 text-white"
                      placeholder="e.g., 4 weeks"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category" className="text-white">Category</Label>
                    <Input
                      id="edit-category"
                      value={selectedCourse.category}
                      onChange={(e) => setSelectedCourse(prev => prev ? {...prev, category: e.target.value} : null)}
                      className="bg-black/30 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-short-description" className="text-white">Short Description</Label>
                  <Input
                    id="edit-short-description"
                    value={selectedCourse.shortDescription || ''}
                    onChange={(e) => setSelectedCourse(prev => prev ? {...prev, shortDescription: e.target.value} : null)}
                    className="bg-black/30 border-gray-600 text-white"
                    placeholder="Brief course description (150 characters max)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-white">Course Description</Label>
                  <Textarea
                    id="edit-description"
                    value={selectedCourse.description}
                    onChange={(e) => setSelectedCourse(prev => prev ? {...prev, description: e.target.value} : null)}
                    className="bg-black/30 border-gray-600 text-white min-h-[100px]"
                    placeholder="Detailed course description..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-learning-outcomes" className="text-white">Learning Outcomes</Label>
                  <Textarea
                    id="edit-learning-outcomes"
                    value={selectedCourse.learningOutcomes || ''}
                    onChange={(e) => setSelectedCourse(prev => prev ? {...prev, learningOutcomes: e.target.value} : null)}
                    className="bg-black/30 border-gray-600 text-white min-h-[80px]"
                    placeholder="What students will learn..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-prerequisites" className="text-white">Prerequisites</Label>
                  <Input
                    id="edit-prerequisites"
                    value={selectedCourse.prerequisites || ''}
                    onChange={(e) => setSelectedCourse(prev => prev ? {...prev, prerequisites: e.target.value} : null)}
                    className="bg-black/30 border-gray-600 text-white"
                    placeholder="Required knowledge or skills..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-is-free-tier"
                    checked={selectedCourse.isFreeTier}
                    onCheckedChange={(checked) => setSelectedCourse(prev => prev ? {...prev, isFreeTier: checked as boolean} : null)}
                    className="border-gray-600"
                  />
                  <Label htmlFor="edit-is-free-tier" className="text-white">Free Tier Course</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-published"
                    checked={selectedCourse.published}
                    onCheckedChange={(checked) => setSelectedCourse(prev => prev ? {...prev, published: checked as boolean} : null)}
                    className="border-gray-600"
                  />
                  <Label htmlFor="edit-published" className="text-white">Published</Label>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCourse(null)}
                    className="text-white border-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        setLoading(true)
                        const response = await fetch(`/api/learning/courses/${selectedCourse.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: selectedCourse.title,
                            description: selectedCourse.description,
                            shortDescription: selectedCourse.shortDescription,
                            duration: selectedCourse.duration,
                            difficulty: selectedCourse.difficulty,
                            category: selectedCourse.category,
                            isFreeTier: selectedCourse.isFreeTier,
                            prerequisites: selectedCourse.prerequisites,
                            learningOutcomes: selectedCourse.learningOutcomes,
                            published: selectedCourse.published
                          })
                        })

                        if (response.ok) {
                          toast.success("Course updated successfully!")
                          setSelectedCourse(null)
                          fetchCourses() // Refresh the course list
                        } else {
                          const error = await response.json()
                          toast.error(error.error || "Failed to update course")
                        }
                      } catch (error) {
                        console.error('Update error:', error)
                        toast.error("Failed to update course")
                      } finally {
                        setLoading(false)
                      }
                    }}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Course
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </BeamsBackground>
    </div>
  )
}