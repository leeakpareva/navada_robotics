import { describe, it, expect } from 'vitest'

describe('Date utilities', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15T10:30:00')
    const formatted = date.toLocaleDateString('en-US')
    expect(formatted).toBeTruthy()
  })

  it('should parse ISO date string', () => {
    const dateString = '2024-01-15T10:30:00Z'
    const date = new Date(dateString)
    expect(date.getFullYear()).toBe(2024)
    expect(date.getMonth()).toBe(0) // January is 0
  })

  it('should calculate date difference', () => {
    const date1 = new Date('2024-01-15')
    const date2 = new Date('2024-01-20')
    const diffInDays = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
    expect(diffInDays).toBe(5)
  })
})