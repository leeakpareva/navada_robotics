export interface SurveyWindow {
  startTime: Date
  endTime: Date
  isActive: boolean
}

export const SURVEY_CONFIG = {
  // Survey window configuration
  WINDOW_DURATION_HOURS: 24,

  // Set your survey start time here (in UTC)
  // For testing: Set to current time minus 1 hour to ensure it's active
  SURVEY_START_TIME: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago

  // Calculate end time based on start time + 24 hours
  get SURVEY_END_TIME() {
    const endTime = new Date(this.SURVEY_START_TIME)
    endTime.setHours(endTime.getHours() + this.WINDOW_DURATION_HOURS)
    return endTime
  },

  // Check if survey is currently active
  get IS_SURVEY_ACTIVE() {
    const now = new Date()
    return now >= this.SURVEY_START_TIME && now <= this.SURVEY_END_TIME
  },

  // Get time remaining in survey window
  get TIME_REMAINING() {
    const now = new Date()
    if (!this.IS_SURVEY_ACTIVE) return null

    const timeLeft = this.SURVEY_END_TIME.getTime() - now.getTime()
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

    return {
      hours: hoursLeft,
      minutes: minutesLeft,
      totalMs: timeLeft
    }
  },

  // Format remaining time for display
  get FORMATTED_TIME_REMAINING() {
    const remaining = this.TIME_REMAINING
    if (!remaining) return null

    if (remaining.hours > 0) {
      return `${remaining.hours}h ${remaining.minutes}m remaining`
    }
    return `${remaining.minutes}m remaining`
  }
}

// Helper function to check if survey submissions should be accepted
export function isSurveySubmissionAllowed(): boolean {
  return SURVEY_CONFIG.IS_SURVEY_ACTIVE
}

// Helper function to get survey status for UI
export function getSurveyStatus() {
  const now = new Date()
  const startTime = SURVEY_CONFIG.SURVEY_START_TIME
  const endTime = SURVEY_CONFIG.SURVEY_END_TIME

  if (now < startTime) {
    return {
      status: 'upcoming',
      message: `Survey opens on ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}`,
      canParticipate: false
    }
  }

  if (now > endTime) {
    return {
      status: 'closed',
      message: `Survey window closed on ${endTime.toLocaleDateString()} at ${endTime.toLocaleTimeString()}`,
      canParticipate: false
    }
  }

  return {
    status: 'active',
    message: SURVEY_CONFIG.FORMATTED_TIME_REMAINING || 'Survey is active',
    canParticipate: true,
    timeRemaining: SURVEY_CONFIG.TIME_REMAINING
  }
}