"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle } from "lucide-react"

interface LearningInterestFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  className?: string
}

export function LearningInterestForm({ onSubmit, className = "" }: LearningInterestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className={`bg-black/30 border-green-400/50 backdrop-blur-sm ${className}`}>
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Interest Recorded!</h3>
            <p className="text-gray-300">Thank you for your interest in learning with NAVADA. We'll keep you updated on our learning platform development.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-black/30 border-purple-400/50 backdrop-blur-sm hover:bg-black/40 transition-all duration-300 ${className}`}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <BookOpen className="h-6 w-6 text-purple-300" />
          </div>
          <div>
            <CardTitle className="text-white">Interested in Learning?</CardTitle>
            <CardDescription className="text-gray-300">
              Share your thoughts about learning robotics and AI with NAVADA
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
              What would you like to learn about? *
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              required
              className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Tell us about your interest in robotics, AI, or programming with Raspberry Pi..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <input type="hidden" name="source" value="learning-page" />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Share Your Interest"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}