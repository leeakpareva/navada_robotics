import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const defaultCourses = [
  {
    title: "AI Fundamentals & Machine Learning",
    shortDescription: "Master the complete foundation of artificial intelligence and machine learning from theory to practical applications",
    description: "This comprehensive course covers everything from basic AI concepts to advanced machine learning algorithms. You'll learn linear regression, decision trees, neural networks, and how to implement them in Python. Includes hands-on projects with real datasets.",
    duration: "6 weeks",
    difficulty: "Beginner",
    category: "AI & Machine Learning",
    isFreeTier: true,
    prerequisites: "Basic programming knowledge in Python",
    learningOutcomes: "• Understand fundamental AI and ML concepts\n• Build and train machine learning models\n• Work with popular Python libraries (scikit-learn, pandas)\n• Complete 5 real-world projects\n• Prepare for advanced AI courses",
    lessons: [
      {
        title: "Introduction to Artificial Intelligence",
        description: "Learn the basics of AI and its applications",
        content: "Welcome to the exciting world of Artificial Intelligence! In this lesson, we'll explore what AI is, its history, and its current applications. AI is the simulation of human intelligence in machines that are programmed to think and learn like humans. We'll cover different types of AI, including narrow AI, general AI, and superintelligence. You'll also learn about machine learning, deep learning, and how they relate to AI.",
        orderIndex: 0,
        duration: 45,
        lessonType: "text"
      },
      {
        title: "Python for Machine Learning",
        description: "Essential Python skills for ML development",
        content: "Python is the most popular programming language for machine learning. In this lesson, we'll cover essential Python libraries like NumPy for numerical computing, Pandas for data manipulation, and Matplotlib for data visualization. You'll learn how to work with arrays, dataframes, and create visualizations that help you understand your data.",
        orderIndex: 1,
        duration: 60,
        lessonType: "text"
      },
      {
        title: "Supervised Learning Algorithms",
        description: "Linear regression, decision trees, and more",
        content: "Supervised learning is a type of machine learning where we train algorithms on labeled data. In this lesson, we'll explore linear regression for predicting continuous values, decision trees for classification tasks, and support vector machines. You'll learn when to use each algorithm and how to implement them using scikit-learn.",
        orderIndex: 2,
        duration: 75,
        lessonType: "text"
      },
      {
        title: "Hands-on Project: House Price Prediction",
        description: "Build your first ML model",
        content: "Now it's time to apply what you've learned! In this project, you'll build a machine learning model to predict house prices using real estate data. We'll go through the entire process: data collection, cleaning, feature engineering, model training, and evaluation. You'll use linear regression and random forest algorithms to make predictions.",
        orderIndex: 3,
        duration: 90,
        lessonType: "text"
      }
    ]
  },
  {
    title: "Computer Vision & Image Processing",
    shortDescription: "Learn to build intelligent systems that can see and understand visual data using OpenCV and deep learning",
    description: "Dive deep into computer vision techniques from basic image processing to advanced deep learning models. Build real applications like face detection, object recognition, and image classification systems.",
    duration: "5 weeks",
    difficulty: "Intermediate",
    category: "Computer Vision",
    isFreeTier: true,
    prerequisites: "Basic Python knowledge and familiarity with machine learning concepts",
    learningOutcomes: "• Master OpenCV for image processing\n• Build object detection systems\n• Implement facial recognition\n• Create image classification models\n• Deploy vision applications",
    lessons: [
      {
        title: "Introduction to Computer Vision",
        description: "Fundamentals of image processing",
        content: "Computer vision is a field of artificial intelligence that trains computers to interpret and understand the visual world. In this lesson, we'll explore how computers see images as arrays of numbers, learn about pixels, color channels, and image formats. We'll also cover the history of computer vision and its modern applications in autonomous vehicles, medical imaging, and security systems.",
        orderIndex: 0,
        duration: 50,
        lessonType: "text"
      },
      {
        title: "OpenCV Basics",
        description: "Getting started with OpenCV library",
        content: "OpenCV (Open Source Computer Vision Library) is the most popular library for computer vision tasks. In this lesson, you'll learn how to install OpenCV, load and display images, perform basic operations like resizing, cropping, and rotation. We'll also cover color space conversions and basic image filtering techniques.",
        orderIndex: 1,
        duration: 65,
        lessonType: "text"
      },
      {
        title: "Object Detection with YOLO",
        description: "Real-time object detection",
        content: "YOLO (You Only Look Once) is a state-of-the-art, real-time object detection system. In this lesson, you'll learn how YOLO works, how to implement it using pre-trained models, and how to detect multiple objects in images and videos. We'll build a practical application that can identify cars, people, and other objects in real-time.",
        orderIndex: 2,
        duration: 80,
        lessonType: "text"
      }
    ]
  },
  {
    title: "AI Agent Development & Deployment",
    shortDescription: "Build, customize, and deploy intelligent AI agents from scratch, including integration with modern frameworks",
    description: "Learn to create sophisticated AI agents that can interact with users, process natural language, and integrate with various APIs. From concept to deployment, master the complete AI agent development lifecycle.",
    duration: "4 weeks",
    difficulty: "Advanced",
    category: "AI Development",
    isFreeTier: true,
    prerequisites: "Python programming, basic understanding of APIs, and machine learning fundamentals",
    learningOutcomes: "• Design conversational AI agents\n• Integrate with OpenAI and other APIs\n• Deploy agents to cloud platforms\n• Implement memory and context handling\n• Build multi-modal agent capabilities",
    lessons: [
      {
        title: "AI Agent Architecture",
        description: "Understanding agent design patterns",
        content: "AI agents are autonomous systems that can perceive their environment and take actions to achieve specific goals. In this lesson, we'll explore different agent architectures, including reactive agents, deliberative agents, and hybrid systems. You'll learn about the key components: perception, reasoning, planning, and action execution.",
        orderIndex: 0,
        duration: 55,
        lessonType: "text"
      },
      {
        title: "Natural Language Processing for Agents",
        description: "Teaching agents to understand language",
        content: "For an AI agent to be truly useful, it needs to understand and generate human language. In this lesson, we'll cover NLP techniques specifically for agent development, including intent recognition, entity extraction, and response generation. We'll use modern transformer models and learn how to fine-tune them for specific tasks.",
        orderIndex: 1,
        duration: 70,
        lessonType: "text"
      },
      {
        title: "Building Your First Chatbot",
        description: "Create a functional AI assistant",
        content: "Now let's put theory into practice! In this hands-on lesson, you'll build a complete chatbot from scratch. We'll use Python, integrate with OpenAI's API, implement conversation memory, and add the ability to perform actions like weather lookups and calendar management. By the end, you'll have a working AI assistant.",
        orderIndex: 2,
        duration: 95,
        lessonType: "text"
      }
    ]
  }
]

export async function POST(request: NextRequest) {
  try {
    // Parse request body to check for bypass parameter
    const body = await request.json().catch(() => ({}))

    // Check authentication - only admin can seed courses (or bypass with special param)
    const session = await getServerSession()
    if (!session || session.user?.email !== "leeakpareva@gmail.com") {
      // Allow bypass for initial seeding with special parameter
      if (body.bypassAuth !== "initial-seed-navada-2024") {
        return NextResponse.json(
          { error: "Unauthorized. Admin access required." },
          { status: 401 }
        )
      }
    }

    console.log("[Seed] Starting to seed default courses...")

    let createdCount = 0
    let skippedCount = 0

    for (const courseData of defaultCourses) {
      // Check if course already exists
      const existingCourse = await prisma.courses.findFirst({
        where: { title: courseData.title }
      })

      if (existingCourse) {
        console.log(`[Seed] Course "${courseData.title}" already exists, skipping...`)
        skippedCount++
        continue
      }

      // Create course with lessons in a transaction
      await prisma.$transaction(async (tx) => {
        const courseId = uuidv4()

        // Create the course
        const course = await tx.courses.create({
          data: {
            id: courseId,
            title: courseData.title,
            shortDescription: courseData.shortDescription,
            description: courseData.description,
            duration: courseData.duration,
            difficulty: courseData.difficulty,
            category: courseData.category,
            isFreeTier: courseData.isFreeTier,
            prerequisites: courseData.prerequisites,
            learningOutcomes: courseData.learningOutcomes,
            updatedAt: new Date()
          }
        })

        // Create lessons
        for (const lessonData of courseData.lessons) {
          await tx.lessons.create({
            data: {
              id: uuidv4(),
              courseId: course.id,
              title: lessonData.title,
              description: lessonData.description,
              content: lessonData.content,
              orderIndex: lessonData.orderIndex,
              duration: lessonData.duration,
              lessonType: lessonData.lessonType,
              published: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        }

        console.log(`[Seed] Created course: "${courseData.title}" with ${courseData.lessons.length} lessons`)
        createdCount++
      })
    }

    console.log(`[Seed] Seeding complete! Created: ${createdCount}, Skipped: ${skippedCount}`)

    return NextResponse.json({
      success: true,
      message: `Seeding complete! Created ${createdCount} courses, skipped ${skippedCount} existing courses`,
      created: createdCount,
      skipped: skippedCount
    })

  } catch (error) {
    console.error("[Seed] Error seeding courses:", error)
    return NextResponse.json(
      { error: "Failed to seed courses", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}