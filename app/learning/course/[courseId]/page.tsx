"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { BeamsBackground } from "@/components/ui/beams-background"
import { VideoPlayerOptimized as VideoPlayer } from "@/components/ui/video-player-optimized"
import { LessonNotes } from "@/components/ui/lesson-notes"
import { TextToSpeech } from "@/components/ui/text-to-speech"
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
  ChevronRight,
  Image,
  HelpCircle,
  Brain,
  Target,
  Lightbulb,
  StickyNote
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface LessonImage {
  id: string
  url: string
  caption: string
  alt: string
}

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
  quiz?: QuizQuestion[]
  images?: LessonImage[]
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
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [generatingQuiz, setGeneratingQuiz] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>([])
  const [readingTime, setReadingTime] = useState(0)
  const [lastScrollPosition, setLastScrollPosition] = useState(0)

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    fetchCourseAndProgress()
  }, [session, courseId])

  // Reading progress tracking
  useEffect(() => {
    if (!currentLesson) return

    // Load saved reading progress
    const loadReadingProgress = async () => {
      try {
        const response = await fetch(`/api/learning/reading-progress?lessonId=${currentLesson.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.progress) {
            setLastScrollPosition(data.progress.scrollPosition)
            setReadingTime(data.progress.readingTime)
            // Restore scroll position after a short delay
            setTimeout(() => {
              window.scrollTo(0, data.progress.scrollPosition)
            }, 500)
          }
        }
      } catch (error) {
        console.error("Error loading reading progress:", error)
      }
    }

    loadReadingProgress()

    // Track reading time
    const startTime = Date.now()
    const readingInterval = setInterval(() => {
      setReadingTime(prev => prev + 1)
    }, 1000)

    // Auto-save scroll position
    const saveProgress = () => {
      const scrollPosition = window.scrollY
      if (Math.abs(scrollPosition - lastScrollPosition) > 50) { // Only save if significant scroll
        setLastScrollPosition(scrollPosition)
        fetch("/api/learning/reading-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: currentLesson.id,
            scrollPosition,
            readingTime: Math.floor((Date.now() - startTime) / 1000)
          })
        }).catch(console.error)
      }
    }

    const scrollHandler = () => {
      clearTimeout((window as any).scrollTimeout)
      ;(window as any).scrollTimeout = setTimeout(saveProgress, 1000)
    }

    window.addEventListener('scroll', scrollHandler)

    return () => {
      clearInterval(readingInterval)
      window.removeEventListener('scroll', scrollHandler)
      saveProgress() // Save final progress
    }
  }, [currentLesson, lastScrollPosition])

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

  const handleLessonChange = (lesson: Lesson) => {
    setCurrentLesson(lesson)
    // Reset quiz state when changing lessons
    setQuizAnswers({})
    setQuizSubmitted(false)
    setQuizScore(null)
    setGeneratedQuestions([])
  }

  const generateQuizQuestions = async () => {
    if (!currentLesson) return

    setGeneratingQuiz(true)
    try {
      const response = await fetch("/api/learning/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonTitle: currentLesson.title,
          lessonContent: currentLesson.content,
          difficulty: course?.difficulty?.toLowerCase() || "medium",
          questionCount: 3
        })
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedQuestions(data.questions || [])
        toast.success("Quiz questions generated successfully!")
      } else {
        throw new Error("Failed to generate quiz questions")
      }
    } catch (error) {
      console.error("Error generating quiz:", error)
      toast.error("Failed to generate quiz questions")
    } finally {
      setGeneratingQuiz(false)
    }
  }

  const submitQuiz = () => {
    const questions = generatedQuestions.length > 0 ? generatedQuestions : (currentLesson?.quiz || [])
    if (questions.length === 0) return

    let correct = 0

    questions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correct++
      }
    })

    const score = Math.round((correct / questions.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)

    if (score >= 70) {
      toast.success(`Great job! You scored ${score}%`)
    } else {
      toast.error(`You scored ${score}%. Try again to improve your understanding.`)
    }
  }

  const resetQuiz = () => {
    setQuizAnswers({})
    setQuizSubmitted(false)
    setQuizScore(null)
    // Don't reset generated questions, just reset the answers
  }

  // Enhanced lesson content formatter
  const formatLessonContent = (content: string) => {
    // Split content into paragraphs and format
    const paragraphs = content.split('\n\n').filter(p => p.trim())

    return paragraphs.map((paragraph, index) => {
      // Check if it's a heading (starts with ##)
      if (paragraph.trim().startsWith('##')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            {paragraph.replace('##', '').trim()}
          </h3>
        )
      }

      // Check if it's a bullet point list
      if (paragraph.includes('•') || paragraph.includes('-')) {
        const items = paragraph.split('\n').filter(item => item.trim())
        return (
          <ul key={index} className="space-y-2 mb-6">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start gap-3 text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">{item.replace(/^[•-]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        )
      }

      // Regular paragraph
      return (
        <p key={index} className="text-gray-300 leading-relaxed mb-6 text-lg">
          {paragraph.trim()}
        </p>
      )
    })
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
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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

                      // Check if this lesson is unlocked (first lesson or previous lesson completed)
                      const isUnlocked = index === 0 || isLessonCompleted(course.lessons[index - 1].id)

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => isUnlocked ? handleLessonChange(lesson) : null}
                          disabled={!isUnlocked}
                          className={`w-full text-left px-4 py-3 transition-colors ${
                            isCurrent
                              ? "bg-purple-600/20 border-l-4 border-purple-500"
                              : isUnlocked
                                ? "hover:bg-gray-800/50"
                                : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-400" />
                              ) : !isUnlocked ? (
                                <Lock className="h-5 w-5 text-gray-600" />
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
                      <TabsList className="grid w-full grid-cols-5 bg-gray-800">
                        <TabsTrigger value="content" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Content
                        </TabsTrigger>
                        <TabsTrigger value="quiz" className="flex items-center gap-2" disabled={!isLessonCompleted(currentLesson.id)}>
                          {!isLessonCompleted(currentLesson.id) ? <Lock className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
                          Quiz
                        </TabsTrigger>
                        <TabsTrigger value="notes" className="flex items-center gap-2">
                          <StickyNote className="h-4 w-4" />
                          Notes
                        </TabsTrigger>
                        <TabsTrigger value="resources" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Resources
                        </TabsTrigger>
                        <TabsTrigger value="discussion" className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Discussion
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="content" className="mt-6">
                        {currentLesson.videoUrl ? (
                          <VideoPlayer
                            videoUrl={currentLesson.videoUrl}
                            title={currentLesson.title}
                            className="mb-8"
                            onProgress={(currentTime, duration) => {
                              // Track video progress for analytics
                              console.log(`Video progress: ${Math.round((currentTime / duration) * 100)}%`)
                            }}
                            onComplete={() => {
                              // Auto-mark lesson as complete when video finishes
                              if (!isLessonCompleted(currentLesson.id)) {
                                markLessonComplete(currentLesson.id)
                              }
                            }}
                          />
                        ) : null}

                        {/* Enhanced Content with Better Formatting */}
                        <div className="space-y-6">
                          {formatLessonContent(currentLesson.content)}
                        </div>

                        {/* Lesson Images Section */}
                        {currentLesson.images && currentLesson.images.length > 0 && (
                          <div className="mt-8">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <Image className="h-5 w-5 text-purple-400" />
                              Visual Learning Materials
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {currentLesson.images.map((image, index) => (
                                <Card key={index} className="bg-gray-800/50 border-gray-700 overflow-hidden hover:border-purple-400 transition-colors">
                                  <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center">
                                    <Image className="h-12 w-12 text-purple-400" />
                                  </div>
                                  <CardContent className="p-4">
                                    <p className="text-white font-medium text-sm mb-1">{image.caption}</p>
                                    <p className="text-gray-400 text-xs">{image.alt}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Learning Points */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/30">
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-400" />
                            Key Takeaways
                          </h4>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-3 text-gray-300">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Apply the concepts learned in this lesson to real-world scenarios</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Practice the techniques through hands-on exercises</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Review and test your understanding with the quiz</span>
                            </li>
                          </ul>
                        </div>

                        {/* Text to Speech */}
                        <div className="mt-8">
                          <TextToSpeech
                            text={currentLesson.content}
                            title={currentLesson.title}
                            className="max-w-4xl"
                          />
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                          <Button
                            onClick={() => {
                              const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id)
                              if (currentIndex > 0) {
                                handleLessonChange(course.lessons[currentIndex - 1])
                              }
                            }}
                            disabled={course.lessons[0].id === currentLesson.id}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Previous
                          </Button>

                          <div className="flex items-center gap-3">
                            {(currentLesson.quiz?.length > 0 || generatedQuestions.length > 0 || isLessonCompleted(currentLesson.id)) && (
                              <Button
                                onClick={() => {
                                  if (currentLesson.quiz?.length > 0 || generatedQuestions.length > 0) {
                                    setActiveTab("quiz")
                                  } else {
                                    generateQuizQuestions()
                                  }
                                }}
                                disabled={!isLessonCompleted(currentLesson.id) || generatingQuiz}
                                variant="outline"
                                className={isLessonCompleted(currentLesson.id)
                                  ? "border-purple-400 text-purple-300 hover:bg-purple-600 hover:text-white"
                                  : "border-gray-600 text-gray-500 cursor-not-allowed"
                                }
                              >
                                {generatingQuiz ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                  </>
                                ) : !isLessonCompleted(currentLesson.id) ? (
                                  <>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Take Quiz (Complete first)
                                  </>
                                ) : (currentLesson.quiz?.length > 0 || generatedQuestions.length > 0) ? (
                                  <>
                                    <Brain className="h-4 w-4 mr-2" />
                                    Take Quiz
                                  </>
                                ) : (
                                  <>
                                    <Brain className="h-4 w-4 mr-2" />
                                    Generate Quiz
                                  </>
                                )}
                              </Button>
                            )}

                            {!isLessonCompleted(currentLesson.id) ? (
                              <Button
                                onClick={() => markLessonComplete(currentLesson.id)}
                                disabled={savingProgress}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6"
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
                              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Completed ✓
                              </Badge>
                            )}
                          </div>

                          <Button
                            onClick={() => {
                              const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id)
                              if (currentIndex < course.lessons.length - 1) {
                                handleLessonChange(course.lessons[currentIndex + 1])
                              }
                            }}
                            disabled={course.lessons[course.lessons.length - 1].id === currentLesson.id}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </TabsContent>

                      {/* Quiz Tab Content */}
                      <TabsContent value="quiz" className="mt-6">
                        {(currentLesson.quiz && currentLesson.quiz.length > 0) || generatedQuestions.length > 0 ? (
                          <div className="space-y-6">
                            <div className="text-center mb-8">
                              <div className="flex items-center justify-between mb-4">
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-4 py-2 rounded-full border border-purple-400/50">
                                  <Brain className="h-5 w-5 text-purple-300" />
                                  <span className="text-purple-300 font-medium">Knowledge Check</span>
                                </div>
                                {isLessonCompleted(currentLesson.id) && (
                                  <Button
                                    onClick={generateQuizQuestions}
                                    disabled={generatingQuiz}
                                    variant="outline"
                                    size="sm"
                                    className="border-purple-400 text-purple-300 hover:bg-purple-600 hover:text-white"
                                  >
                                    {generatingQuiz ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <Brain className="h-4 w-4 mr-2" />
                                        {generatedQuestions.length > 0 || (currentLesson.quiz && currentLesson.quiz.length > 0) ? "Regenerate Quiz" : "Generate Quiz"}
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                              <h3 className="text-2xl font-bold text-white">Test Your Understanding</h3>
                              <p className="text-gray-400 mt-2">
                                {generatedQuestions.length > 0 ? "AI-generated questions based on lesson content" : "Answer all questions to check your learning progress"}
                              </p>
                            </div>

                            {(generatedQuestions.length > 0 ? generatedQuestions : currentLesson.quiz || []).map((question, index) => (
                              <Card key={question.id} className="bg-gray-800/50 border-gray-700">
                                <CardHeader>
                                  <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                                      {index + 1}
                                    </span>
                                    {question.question}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <RadioGroup
                                    value={quizAnswers[question.id]?.toString()}
                                    onValueChange={(value) =>
                                      setQuizAnswers(prev => ({
                                        ...prev,
                                        [question.id]: parseInt(value)
                                      }))
                                    }
                                    disabled={quizSubmitted}
                                    className="space-y-3"
                                  >
                                    {question.options.map((option, optionIndex) => (
                                      <div key={optionIndex} className="flex items-center space-x-3">
                                        <RadioGroupItem
                                          value={optionIndex.toString()}
                                          id={`${question.id}-${optionIndex}`}
                                          className="border-gray-600 text-purple-400"
                                        />
                                        <Label
                                          htmlFor={`${question.id}-${optionIndex}`}
                                          className={`text-gray-300 cursor-pointer flex-1 p-3 rounded-lg border transition-colors ${
                                            quizSubmitted
                                              ? optionIndex === question.correctAnswer
                                                ? "border-green-500 bg-green-500/10 text-green-300"
                                                : quizAnswers[question.id] === optionIndex && optionIndex !== question.correctAnswer
                                                ? "border-red-500 bg-red-500/10 text-red-300"
                                                : "border-gray-600 bg-gray-800/30"
                                              : "border-gray-600 bg-gray-800/30 hover:border-purple-400 hover:bg-purple-400/10"
                                          }`}
                                        >
                                          {option}
                                        </Label>
                                      </div>
                                    ))}
                                  </RadioGroup>

                                  {quizSubmitted && (
                                    <div className="mt-4 p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
                                      <p className="text-blue-300 text-sm">
                                        <strong>Explanation:</strong> {question.explanation}
                                      </p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}

                            <div className="flex items-center justify-between pt-6">
                              {!quizSubmitted ? (
                                <Button
                                  onClick={submitQuiz}
                                  disabled={Object.keys(quizAnswers).length !== (generatedQuestions.length > 0 ? generatedQuestions.length : (currentLesson.quiz?.length || 0))}
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
                                >
                                  <Brain className="h-4 w-4 mr-2" />
                                  Submit Quiz
                                </Button>
                              ) : (
                                <div className="flex items-center gap-4">
                                  <div className={`px-4 py-2 rounded-lg border ${
                                    quizScore >= 70
                                      ? "border-green-500 bg-green-500/10 text-green-300"
                                      : "border-red-500 bg-red-500/10 text-red-300"
                                  }`}>
                                    <span className="font-semibold">Score: {quizScore}%</span>
                                  </div>
                                  <Button
                                    onClick={resetQuiz}
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                  >
                                    Retake Quiz
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Brain className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 mb-4">No quiz available for this lesson</p>
                            {isLessonCompleted(currentLesson.id) ? (
                              <Button
                                onClick={generateQuizQuestions}
                                disabled={generatingQuiz}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              >
                                {generatingQuiz ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating Quiz...
                                  </>
                                ) : (
                                  <>
                                    <Brain className="h-4 w-4 mr-2" />
                                    Generate AI Quiz
                                  </>
                                )}
                              </Button>
                            ) : (
                              <p className="text-gray-500 text-sm">Complete the lesson to generate a quiz</p>
                            )}
                          </div>
                        )}
                      </TabsContent>

                      {/* Notes Tab Content */}
                      <TabsContent value="notes" className="mt-6">
                        <LessonNotes
                          lessonId={currentLesson.id}
                          courseId={courseId}
                          className="max-w-4xl"
                        />
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

                          {currentLesson.resources && Array.isArray(currentLesson.resources) && currentLesson.resources.length > 0 && (
                            <Card className="bg-gray-800/50 border-gray-700">
                              <CardContent className="pt-6">
                                <h3 className="text-white font-medium mb-2">Additional Resources</h3>
                                <div className="space-y-2">
                                  {currentLesson.resources.map((resource: any, idx: number) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                      <Download className="h-4 w-4 text-purple-400" />
                                      <span className="text-gray-300 text-sm">
                                        {typeof resource === 'string' ? resource : JSON.stringify(resource)}
                                      </span>
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