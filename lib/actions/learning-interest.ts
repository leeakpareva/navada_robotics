'use server'

import { prisma } from '@/lib/prisma'

export async function createLearningInterest(formData: FormData) {
  try {
    // Extract form data
    const comment = formData.get('comment') as string
    const email = formData.get('email') as string || null
    const name = formData.get('name') as string || null
    const source = formData.get('source') as string || 'learning-page'

    console.log('Form data received:', { comment, email, name, source })

    // Validate required fields
    if (!comment || comment.trim().length === 0) {
      throw new Error('Comment is required')
    }

    // Insert the learning interest comment using Prisma
    console.log('Attempting to insert data with Prisma...')
    const result = await prisma.learningComment.create({
      data: {
        comment: comment.trim(),
        email: email || null,
        name: name || null,
        source: source
      }
    })

    console.log('Learning interest comment saved successfully:', result.id)
    return { success: true, id: result.id }
  } catch (error) {
    console.error('Detailed error saving learning interest:', error)
    console.error('Error name:', error?.name)
    console.error('Error message:', error?.message)
    throw new Error('Failed to save your interest. Please try again.')
  }
}