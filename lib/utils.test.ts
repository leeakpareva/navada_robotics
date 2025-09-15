import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('base-class', 'additional-class')
    expect(result).toBe('base-class additional-class')
  })

  it('should handle conditional classes', () => {
    const result = cn('base', { 'conditional': true, 'not-included': false })
    expect(result).toBe('base conditional')
  })

  it('should handle undefined and null values', () => {
    const result = cn('base', undefined, null, 'final')
    expect(result).toBe('base final')
  })

  it('should merge tailwind classes correctly', () => {
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })
})