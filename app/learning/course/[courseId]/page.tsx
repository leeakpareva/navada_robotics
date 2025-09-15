"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BeamsBackground } from "@/components/ui/beams-background"
import {
  BookOpen,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  Video,
  MessageSquare,
  Award,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lock,
  Bot,
  Download,
  Share2,
  Star,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Lesson {
  id: string
  title: string
  description: string
  content: string
  duration: number
  lessonType: string
  videoUrl?: string
  resources?: string
  orderIndex: number
}

interface Course {
  id: string
  title: string
  description: string
  duration: string
  difficulty: string
  category: string
  learningOutcomes: string
  prerequisites?: string
  lessons: Lesson[]
}

interface Progress {
  progressPercentage: number
  completedLessons: number
  totalLessons: number
  lesson_progress: any[]
}

export default function CourseViewerPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingProgress, setSavingProgress] = useState(false)
  const [activeTab, setActiveTab] = useState("content")

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    fetchCourseAndProgress()
  }, [session, courseId])

  const fetchCourseAndProgress = async () => {
    try {
      // Fetch course details
      const courseResponse = await fetch(`/api/learning/courses/${courseId}`)
      if (courseResponse.ok) {
        const courseData = await courseResponse.json()
        setCourse(courseData.course)

        // Set first lesson as current by default
        if (courseData.course.lessons?.length > 0) {
          setCurrentLesson(courseData.course.lessons[0])
        }
      }

      // Fetch user progress
      const progressResponse = await fetch(`/api/learning/progress?courseId=${courseId}`)
      if (progressResponse.ok) {
        const progressData = await progressResponse.json()
        setProgress(progressData.progress)
      }
    } catch (error) {
      console.error("Error fetching course:", error)
      toast.error("Failed to load course")
    } finally {
      setLoading(false)
    }
  }

  const markLessonComplete = async (lessonId: string) => {
    setSavingProgress(true)
    try {
      const response = await fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          lessonId,
          completed: true,
          timeSpent: 300 // 5 minutes for now
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Lesson marked as complete!")

        // Update local progress
        if (progress) {
          setProgress({
            ...progress,
            progressPercentage: data.courseProgress.progressPercentage,
            completedLessons: data.courseProgress.completedLessons
          })
        }

        // Move to next lesson if available
        const currentIndex = course?.lessons.findIndex(l => l.id === lessonId) ?? -1
        if (currentIndex !== -1 && currentIndex < (course?.lessons.length ?? 0) - 1) {
          setCurrentLesson(course!.lessons[currentIndex + 1])
        }

        // Check if course is completed
        if (data.courseProgress.isCompleted) {
          toast.success("🎉 Congratulations! You've completed the course!")
        }
      }
    } catch (error) {
      console.error("Error marking lesson complete:", error)
      toast.error("Failed to save progress")
    } finally {
      setSavingProgress(false)
    }
  }

  const isLessonCompleted = (lessonId: string) => {
    return progress?.lesson_progress?.some(lp => lp.lessonId === lessonId && lp.completed) ?? false
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Loading course content...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <p className="text-gray-400">Course not found</p>
          <Button
            onClick={() => router.push("/learning")}
            className="mt-4"
          >
            Back to Courses
          </Button>
        </div>
      </div>
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
                <span>Back to Courses</span>
              </Link>
              <div className="h-6 w-px bg-gray-600"></div>
              <h1 className="text-xl font-bold text-white">{course.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Progress value={progress?.progressPercentage || 0} className="w-32" />
                <span className="text-sm text-gray-400">
                  {progress?.progressPercentage || 0}%
                </span>
              </div>
              <Link href="/agent-lee">
                <Button variant="outline" size="sm" className="border-purple-400 text-purple-300">
                  <Bot className="h-4 w-4 mr-2" />
                  Ask Agent Lee
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <BeamsBackground intensity="subtle" className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Lesson List */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900/95 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Course Content</CardTitle>
                  <CardDescription className="text-gray-400">
                    {progress?.completedLessons || 0} of {course.lessons.length} lessons completed
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {course.lessons.map((lesson, index) => {
                      const isCompleted = isLessonCompleted(lesson.id)
                      const isCurrent = currentLesson?.id === lesson.id

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`w-full text-left px-4 py-3 transition-colors ${
                            isCurrent
                              ? "bg-purple-600/20 border-l-4 border-purple-500"
                              : "hover:bg-gray-800/50"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-400" />
                              ) : lesson.lessonType === "video" ? (
                                <Video className="h-5 w-5 text-blue-400" />
                              ) : (
                                <FileText className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                isCurrent ? "text-white" : "text-gray-300"
                              }`}>
                                {index + 1}. {lesson.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {lesson.duration} min
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Course Info */}
              <Card className="bg-gray-900/95 border-gray-700/50 mt-4">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Difficulty</span>
                    <Badge variant="outline" className="text-gray-300">
                      {course.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white">{course.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">
                      {progress?.completedLessons || 0}/{course.lessons.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {currentLesson && (
                <Card className="bg-gray-900/95 border-gray-700/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-2xl">
                          {currentLesson.title}
                        </CardTitle>
                        {currentLesson.description && (
                          <CardDescription className="text-gray-400 mt-2">
                            {currentLesson.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-gray-300">
                          <Clock className="h-3 w-3 mr-1" />
                          {currentLesson.duration} min
                        </Badge>
                        {currentLesson.lessonType === "video" && (
                          <Badge className="bg-blue-600 text-white">
                            <Video className="h-3 w-3 mr-1" />
                            Video
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                        <TabsTrigger value="discussion">Discussion</TabsTrigger>
                      </TabsList>

                      <TabsContent value="content" className="mt-6">
                        {currentLesson.videoUrl ? (
                          <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-6">
                            <PlayCircle className="h-16 w-16 text-gray-600" />
                            <p className="ml-4 text-gray-400">Video player would load here</p>
                          </div>
                        ) : null}

                        <div className="prose prose-invert max-w-none">
                          <div className="text-gray-300 whitespace-pre-wrap">
                            {currentLesson.content}
                          </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                          <Button
                            variant="outline"
                            onClick={() => {
                              const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id)
                              if (currentIndex > 0) {
                                setCurrentLesson(course.lessons[currentIndex - 1])
                              }
                            }}
                            disabled={course.lessons[0].id === currentLesson.id}
                            className="text-white border-gray-600"
                          >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Previous
                          </Button>

                          {!isLessonCompleted(currentLesson.id) ? (
                            <Button
                              onClick={() => markLessonComplete(currentLesson.id)}
                              disabled={savingProgress}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {savingProgress ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Complete
                                </>
                              )}
                            </Button>
                          ) : (
                            <Badge className="bg-green-600 text-white px-4 py-2">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Completed
                            </Badge>
                          )}

                          <Button
                            onClick={() => {
                              const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id)
                              if (currentIndex < course.lessons.length - 1) {
                                setCurrentLesson(course.lessons[currentIndex + 1])
                              }
                            }}
                            disabled={course.lessons[course.lessons.length - 1].id === currentLesson.id}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="resources" className="mt-6">
                        <div className="space-y-4">
                          <Card className="bg-gray-800/50 border-gray-700">
                            <CardContent className="pt-6">
                              <h3 className="text-white font-medium mb-2">Learning Outcomes</h3>
                              <div className="text-gray-300 whitespace-pre-wrap text-sm">
                                {course.learningOutcomes}
                              </div>
                            </CardContent>
                          </Card>

                          {course.prerequisites && (
                            <Card className="bg-gray-800/50 border-gray-700">
                              <CardContent className="pt-6">
                                <h3 className="text-white font-medium mb-2">Prerequisites</h3>
                                <p className="text-gray-300 text-sm">{course.prerequisites}</p>
                              </CardContent>
                            </Card>
                          )}

                          {currentLesson.resources && (
                            <Card className="bg-gray-800/50 border-gray-700">
                              <CardContent className="pt-6">
                                <h3 className="text-white font-medium mb-2">Additional Resources</h3>
                                <div className="space-y-2">
                                  {JSON.parse(currentLesson.resources).map((resource: any, idx: number) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                      <Download className="h-4 w-4 text-purple-400" />
                                      <span className="text-gray-300 text-sm">{resource}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="discussion" className="mt-6">
                        <Card className="bg-gray-800/50 border-gray-700">
                          <CardContent className="pt-6">
                            <div className="text-center py-8">
                              <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                              <p className="text-gray-400">Discussion forum coming soon</p>
                              <p className="text-sm text-gray-500 mt-2">
                                Connect with other students and share your learning experience
                              </p>
                              <Link href="/agent-lee">
                                <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                                  <Bot className="h-4 w-4 mr-2" />
                                  Chat with Agent Lee
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Certificate Card - Show when course is completed */}
              {progress?.progressPercentage === 100 && (
                <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/50 mt-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Award className="h-12 w-12 text-yellow-400" />
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            Congratulations! Course Completed
                          </h3>
                          <p className="text-gray-300 text-sm">
                            You've successfully completed all lessons in this course
                          </p>
                        </div>
                      </div>
                      <Button className="bg-yellow-600 hover:bg-yellow-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </BeamsBackground>
    </div>
  )
}