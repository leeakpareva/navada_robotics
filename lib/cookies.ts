import Cookies from 'js-cookie'

// Cookie configuration
export const COOKIE_CONFIG = {
  // Expiration: 7 days
  EXPIRES_DAYS: 7,

  // Cookie names
  SURVEY_RESPONSES: 'navada_survey_responses',
  CONTACT_INFO: 'navada_contact_info',
  COOKIE_CONSENT: 'navada_cookie_consent',

  // Security options
  SECURE: process.env.NODE_ENV === 'production',
  SAME_SITE: 'lax' as const,
  HTTP_ONLY: true, // For server-side only cookies
}

// Types
export interface SurveyResponses {
  individual?: Record<string, string>
  business?: Record<string, string>
  lastUpdated?: string
}

export interface ContactInfo {
  name?: string
  email?: string
  phoneNumber?: string
  country?: string
  bankAccount?: string
  bankName?: string
  businessName?: string
  businessEmail?: string
  lastUpdated?: string
}

export interface CookieConsent {
  accepted: boolean
  timestamp: string
  version: string
}

// Client-side cookie utilities
export const clientCookies = {
  /**
   * Get a cookie value on the client-side
   */
  getCookie: (name: string): string | undefined => {
    if (typeof window === 'undefined') return undefined
    return Cookies.get(name)
  },

  /**
   * Set a cookie on the client-side
   */
  setCookie: (
    name: string,
    value: string,
    options: {
      expires?: number
      httpOnly?: boolean
      secure?: boolean
      sameSite?: 'strict' | 'lax' | 'none'
    } = {}
  ): void => {
    if (typeof window === 'undefined') return

    const defaultOptions = {
      expires: COOKIE_CONFIG.EXPIRES_DAYS,
      secure: COOKIE_CONFIG.SECURE,
      sameSite: COOKIE_CONFIG.SAME_SITE,
      ...options
    }

    Cookies.set(name, value, defaultOptions)
  },

  /**
   * Delete a cookie on the client-side
   */
  deleteCookie: (name: string): void => {
    if (typeof window === 'undefined') return
    Cookies.remove(name)
  },

  /**
   * Get survey responses from cookies
   */
  getSurveyResponses: (): SurveyResponses | null => {
    const data = clientCookies.getCookie(COOKIE_CONFIG.SURVEY_RESPONSES)
    if (!data) return null

    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  /**
   * Save survey responses to cookies
   */
  setSurveyResponses: (
    surveyType: 'individual' | 'business',
    responses: Record<string, string>
  ): void => {
    const existing = clientCookies.getSurveyResponses() || {}
    const updated: SurveyResponses = {
      ...existing,
      [surveyType]: responses,
      lastUpdated: new Date().toISOString()
    }

    clientCookies.setCookie(
      COOKIE_CONFIG.SURVEY_RESPONSES,
      JSON.stringify(updated)
    )
  },

  /**
   * Get contact info from cookies
   */
  getContactInfo: (): ContactInfo | null => {
    const data = clientCookies.getCookie(COOKIE_CONFIG.CONTACT_INFO)
    if (!data) return null

    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  /**
   * Save contact info to cookies
   */
  setContactInfo: (info: Partial<ContactInfo>): void => {
    const existing = clientCookies.getContactInfo() || {}
    const updated: ContactInfo = {
      ...existing,
      ...info,
      lastUpdated: new Date().toISOString()
    }

    clientCookies.setCookie(
      COOKIE_CONFIG.CONTACT_INFO,
      JSON.stringify(updated)
    )
  },

  /**
   * Get cookie consent status
   */
  getCookieConsent: (): CookieConsent | null => {
    const data = clientCookies.getCookie(COOKIE_CONFIG.COOKIE_CONSENT)
    if (!data) return null

    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  /**
   * Set cookie consent
   */
  setCookieConsent: (accepted: boolean): void => {
    const consent: CookieConsent = {
      accepted,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }

    // Cookie consent should persist longer and be more secure
    clientCookies.setCookie(
      COOKIE_CONFIG.COOKIE_CONSENT,
      JSON.stringify(consent),
      {
        expires: 365, // 1 year
        secure: true,
        sameSite: 'strict'
      }
    )
  },

  /**
   * Clear all survey-related cookies
   */
  clearSurveyData: (): void => {
    clientCookies.deleteCookie(COOKIE_CONFIG.SURVEY_RESPONSES)
    clientCookies.deleteCookie(COOKIE_CONFIG.CONTACT_INFO)
  }
}


// Universal cookie utilities (work on both client and server)
export const universalCookies = {
  getCookie: (name: string): string | undefined => {
    if (typeof window !== 'undefined') {
      return clientCookies.getCookie(name)
    } else {
      // Server-side - return null for now to avoid import issues
      return undefined
    }
  },

  getSurveyResponses: (): SurveyResponses | null => {
    if (typeof window !== 'undefined') {
      return clientCookies.getSurveyResponses()
    } else {
      return null
    }
  },

  getContactInfo: (): ContactInfo | null => {
    if (typeof window !== 'undefined') {
      return clientCookies.getContactInfo()
    } else {
      return null
    }
  },

  getCookieConsent: (): CookieConsent | null => {
    if (typeof window !== 'undefined') {
      return clientCookies.getCookieConsent()
    } else {
      return null
    }
  },

  hasAcceptedCookies: (): boolean => {
    if (typeof window !== 'undefined') {
      const consent = clientCookies.getCookieConsent()
      return consent?.accepted === true
    } else {
      return false
    }
  }
}

// Export main API
export {
  clientCookies as getCookie,
  clientCookies as setCookie,
  clientCookies as deleteCookie
}