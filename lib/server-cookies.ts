import { cookies } from 'next/headers'
import { COOKIE_CONFIG, SurveyResponses, ContactInfo, CookieConsent } from './cookies'

// Server-side cookie utilities
export const serverCookies = {
  /**
   * Get a cookie value on the server-side
   */
  getCookie: (name: string): string | undefined => {
    try {
      const cookieStore = cookies()
      return cookieStore.get(name)?.value
    } catch {
      return undefined
    }
  },

  /**
   * Set a cookie on the server-side
   */
  setCookie: (
    name: string,
    value: string,
    options: {
      expires?: Date | number
      httpOnly?: boolean
      secure?: boolean
      sameSite?: 'strict' | 'lax' | 'none'
      path?: string
    } = {}
  ): void => {
    try {
      const cookieStore = cookies()
      const expires = options.expires || new Date(Date.now() + COOKIE_CONFIG.EXPIRES_DAYS * 24 * 60 * 60 * 1000)

      const defaultOptions = {
        expires,
        httpOnly: options.httpOnly ?? false,
        secure: options.secure ?? COOKIE_CONFIG.SECURE,
        sameSite: options.sameSite ?? COOKIE_CONFIG.SAME_SITE,
        path: options.path ?? '/',
        ...options
      }

      cookieStore.set(name, value, defaultOptions)
    } catch (error) {
      console.error('Failed to set cookie on server:', error)
    }
  },

  /**
   * Delete a cookie on the server-side
   */
  deleteCookie: (name: string): void => {
    try {
      const cookieStore = cookies()
      cookieStore.delete(name)
    } catch (error) {
      console.error('Failed to delete cookie on server:', error)
    }
  },

  /**
   * Get survey responses from server-side cookies
   */
  getSurveyResponses: (): SurveyResponses | null => {
    const data = serverCookies.getCookie(COOKIE_CONFIG.SURVEY_RESPONSES)
    if (!data) return null

    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  /**
   * Get contact info from server-side cookies
   */
  getContactInfo: (): ContactInfo | null => {
    const data = serverCookies.getCookie(COOKIE_CONFIG.CONTACT_INFO)
    if (!data) return null

    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  /**
   * Get cookie consent from server-side cookies
   */
  getCookieConsent: (): CookieConsent | null => {
    const data = serverCookies.getCookie(COOKIE_CONFIG.COOKIE_CONSENT)
    if (!data) return null

    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  /**
   * Check if user has accepted cookies
   */
  hasAcceptedCookies: (): boolean => {
    const consent = serverCookies.getCookieConsent()
    return consent?.accepted === true
  }
}