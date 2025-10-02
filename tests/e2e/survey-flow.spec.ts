import { test, expect } from '@playwright/test'

test.describe('Survey Data Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data')
  })

  test('displays data page with introduction', async ({ page }) => {
    // Check page title and main heading
    await expect(page).toHaveTitle(/NAVADA/)
    await expect(page.getByText('NAVADA Data Initiative')).toBeVisible()

    // Check introduction content
    await expect(page.getByText('Help shape the future of AI and robotics in Africa')).toBeVisible()

    // Check tabs are visible
    await expect(page.getByText('Introduction')).toBeVisible()
    await expect(page.getByText('Individual Survey')).toBeVisible()
    await expect(page.getByText('Business Survey')).toBeVisible()
  })

  test('shows survey options on introduction tab', async ({ page }) => {
    // Should start on introduction tab
    await expect(page.getByText('About the NAVADA Data Initiative')).toBeVisible()

    // Check survey option cards
    await expect(page.getByText('$5 USD via Stripe')).toBeVisible()
    await expect(page.getByText('$15 USD via Stripe')).toBeVisible()

    // Check feature highlights
    await expect(page.getByText('Secure & Private')).toBeVisible()
    await expect(page.getByText('Get Rewarded')).toBeVisible()
    await expect(page.getByText('Shape the Future')).toBeVisible()
  })

  test('completes individual survey flow', async ({ page }) => {
    // Navigate to individual survey
    await page.getByText('Individual Survey', { exact: true }).click()
    await expect(page.getByText('Your data is protected')).toBeVisible()

    // Check survey header
    await expect(page.getByText('Individual Survey')).toBeVisible()
    await expect(page.getByText('$5 USD')).toBeVisible()

    // Fill out survey questions
    await page.getByText('What is your age group?').waitFor()
    await page.getByLabel('25-34').click()

    await page.getByLabel('Nigeria').click()
    await page.getByLabel('Somewhat familiar').first().click()
    await page.getByLabel('ChatGPT/GPT-based tools').click()
    await page.getByLabel('Basic understanding').click()
    await page.getByLabel('Educational institutions').click()
    await page.getByLabel('Somewhat positive').click()
    await page.getByLabel('Online courses').click()
    await page.getByLabel('Job displacement').click()
    await page.getByLabel('Healthcare').click()

    // Check progress
    await expect(page.getByText('10 of 10 questions')).toBeVisible()

    // Continue to contact information
    await page.getByText('Continue to Contact Information').click()
    await expect(page.getByText('Contact Information for Payment')).toBeVisible()

    // Fill contact information
    await page.getByPlaceholder('Enter your full name').fill('John Doe')
    await page.getByPlaceholder('your.email@example.com').fill('john@example.com')
    await page.getByPlaceholder('payment@example.com').fill('john.payment@example.com')
    await page.getByPlaceholder('e.g., Nigeria').fill('Nigeria')
    await page.getByLabel('I am 18 or older').click()

    // Mock the API response
    await page.route('/api/data/submit-survey', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          submissionId: 'test_submission_123',
          rewardAmount: '$5 USD',
          paymentTimeline: '72 hours'
        })
      })
    })

    // Submit survey
    await page.getByText('Submit Survey & Get $5 USD').click()

    // Check success message
    await expect(page.getByText('Survey Submitted Successfully!')).toBeVisible()
    await expect(page.getByText('john.payment@example.com')).toBeVisible()
    await expect(page.getByText('You\'ll receive $5 USD via Stripe')).toBeVisible()
  })

  test('completes business survey flow', async ({ page }) => {
    // Navigate to business survey
    await page.getByText('Business Survey', { exact: true }).click()

    // Check survey header shows higher reward
    await expect(page.getByText('Business Survey')).toBeVisible()
    await expect(page.getByText('$15 USD')).toBeVisible()

    // Fill out business survey questions
    await page.getByLabel('11-50 employees').click()
    await page.getByLabel('Technology').click()
    await page.getByLabel('Exploring AI possibilities').click()
    await page.getByLabel('Data analytics and insights').click()
    await page.getByLabel('Considering robotics solutions').click()
    await page.getByLabel('Lack of skilled personnel').click()
    await page.getByLabel('5-10%').click()
    await page.getByLabel('Competitive advantage').click()
    await page.getByLabel('Very interested').click()
    await page.getByLabel('Significant positive change').click()

    // Continue and fill contact info
    await page.getByText('Continue to Contact Information').click()
    await page.getByPlaceholder('Enter your full name').fill('Jane Smith')
    await page.getByPlaceholder('your.email@example.com').fill('jane@company.com')
    await page.getByPlaceholder('payment@example.com').fill('jane.payment@company.com')
    await page.getByPlaceholder('e.g., Nigeria').fill('Ghana')
    await page.getByLabel('I am 18 or older').click()

    // Mock successful submission
    await page.route('/api/data/submit-survey', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          submissionId: 'test_business_123',
          rewardAmount: '$15 USD',
          paymentTimeline: '72 hours'
        })
      })
    })

    await page.getByText('Submit Survey & Get $15 USD').click()

    // Verify business survey success with higher reward
    await expect(page.getByText('Survey Submitted Successfully!')).toBeVisible()
    await expect(page.getByText('You\'ll receive $15 USD via Stripe')).toBeVisible()
  })

  test('validates survey completion before proceeding', async ({ page }) => {
    // Go to individual survey
    await page.getByText('Individual Survey', { exact: true }).click()

    // Try to continue without answering questions
    await page.getByText('Continue to Contact Information').click()

    // Should show error message
    await expect(page.getByText('Please complete all required questions')).toBeVisible()

    // Answer some but not all questions
    await page.getByLabel('25-34').click()
    await page.getByText('Continue to Contact Information').click()

    // Should still show errors for incomplete questions
    await expect(page.getByText('Please answer:')).toBeVisible()
  })

  test('validates contact information', async ({ page }) => {
    // Complete survey first
    await page.getByText('Individual Survey', { exact: true }).click()

    // Fill all survey questions quickly
    await page.getByLabel('25-34').click()
    await page.getByLabel('Nigeria').click()
    await page.getByLabel('Somewhat familiar').first().click()
    await page.getByLabel('ChatGPT/GPT-based tools').click()
    await page.getByLabel('Basic understanding').click()
    await page.getByLabel('Educational institutions').click()
    await page.getByLabel('Somewhat positive').click()
    await page.getByLabel('Online courses').click()
    await page.getByLabel('Job displacement').click()
    await page.getByLabel('Healthcare').click()

    await page.getByText('Continue to Contact Information').click()

    // Try to submit without filling contact info
    await page.getByText('Submit Survey & Get $5 USD').click()

    // Should show validation errors
    await expect(page.getByText('Please fix the following:')).toBeVisible()
    await expect(page.getByText('Full name is required')).toBeVisible()
    await expect(page.getByText('Email address is required')).toBeVisible()

    // Fill invalid email
    await page.getByPlaceholder('your.email@example.com').fill('invalid-email')
    await page.getByText('Submit Survey & Get $5 USD').click()

    await expect(page.getByText('Please enter a valid email address')).toBeVisible()
  })

  test('handles API errors gracefully', async ({ page }) => {
    // Complete survey flow
    await page.getByText('Individual Survey', { exact: true }).click()

    // Fill survey questions
    await page.getByLabel('25-34').click()
    await page.getByLabel('Nigeria').click()
    await page.getByLabel('Somewhat familiar').first().click()
    await page.getByLabel('ChatGPT/GPT-based tools').click()
    await page.getByLabel('Basic understanding').click()
    await page.getByLabel('Educational institutions').click()
    await page.getByLabel('Somewhat positive').click()
    await page.getByLabel('Online courses').click()
    await page.getByLabel('Job displacement').click()
    await page.getByLabel('Healthcare').click()

    await page.getByText('Continue to Contact Information').click()

    // Fill contact info
    await page.getByPlaceholder('Enter your full name').fill('John Doe')
    await page.getByPlaceholder('your.email@example.com').fill('john@example.com')
    await page.getByPlaceholder('payment@example.com').fill('john.payment@example.com')
    await page.getByPlaceholder('e.g., Nigeria').fill('Nigeria')
    await page.getByLabel('I am 18 or older').click()

    // Mock API error
    await page.route('/api/data/submit-survey', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'You have already submitted this survey type',
          code: 'DUPLICATE_SUBMISSION'
        })
      })
    })

    await page.getByText('Submit Survey & Get $5 USD').click()

    // Should remain on contact form (not show success page)
    await expect(page.getByText('Contact Information for Payment')).toBeVisible()
    await expect(page.getByText('Survey Submitted Successfully!')).not.toBeVisible()
  })

  test('allows navigation between tabs', async ({ page }) => {
    // Start on introduction
    await expect(page.getByText('About the NAVADA Data Initiative')).toBeVisible()

    // Navigate to individual survey
    await page.getByText('Individual Survey', { exact: true }).click()
    await expect(page.getByText('What is your age group?')).toBeVisible()

    // Navigate to business survey
    await page.getByText('Business Survey', { exact: true }).click()
    await expect(page.getByText('What is the size of your organization?')).toBeVisible()

    // Navigate back to introduction
    await page.getByText('Introduction').click()
    await expect(page.getByText('About the NAVADA Data Initiative')).toBeVisible()
  })

  test('shows secure notice on survey forms', async ({ page }) => {
    await page.getByText('Individual Survey', { exact: true }).click()

    await expect(page.getByText('Your data is protected')).toBeVisible()
    await expect(page.getByText('End-to-end encryption')).toBeVisible()
    await expect(page.getByText('Stripe secure payments')).toBeVisible()
    await expect(page.getByText('GDPR compliant')).toBeVisible()
  })

  test('mobile menu works correctly', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Mobile menu should be hidden initially
    await expect(page.getByText('Back to Home')).not.toBeVisible()

    // Click mobile menu button
    await page.locator('button').filter({ hasText: /menu/i }).first().click()

    // Mobile menu should be visible
    await expect(page.getByText('Back to Home')).toBeVisible()
  })

  test('responsive design on different screen sizes', async ({ page }) => {
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText('NAVADA Data Initiative')).toBeVisible()

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('NAVADA Data Initiative')).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByText('NAVADA Data Initiative')).toBeVisible()
  })
})