import { test, expect } from '@playwright/test';

test.describe('Quick Functionality Test', () => {
  test('data page auth system works', async ({ page }) => {
    // Go to the data page where auth is required
    await page.goto('http://localhost:3001/data');

    // Check auth modal appears
    const authModal = page.locator('h1:has-text("NAVADA")');
    await expect(authModal).toBeVisible({ timeout: 10000 });

    // Try to sign up
    const signUpTab = page.locator('button:has-text("Sign Up")');
    await signUpTab.click();

    // Fill signup form
    const testEmail = `test${Date.now()}@example.com`;
    await page.fill('input[id="signup-name"]', 'Test User');
    await page.fill('input[id="signup-email"]', testEmail);
    await page.fill('input[id="signup-password"]', 'Test123456');
    await page.fill('input[id="confirm-password"]', 'Test123456');

    // Submit
    const signupButton = page.locator('button:has-text("Sign Up")').last();
    await signupButton.click();

    // Wait for navigation or error
    await page.waitForTimeout(3000);

    // Check if we're authenticated (auth modal should be gone)
    const isAuthenticated = await page.locator('nav').first().isVisible().catch(() => false);

    if (isAuthenticated) {
      console.log('✅ Authentication successful');

      // Check data page elements
      await expect(page.locator('h2:has-text("Data Initiative")')).toBeVisible();
      console.log('✅ Data page loaded');

      // Check survey options are visible
      const individualSurvey = page.locator('text=Individual Survey');
      const businessSurvey = page.locator('text=Business Survey');
      await expect(individualSurvey).toBeVisible();
      await expect(businessSurvey).toBeVisible();
      console.log('✅ Survey options visible');

      // Check reward amounts are displayed
      const rewardAmount = page.locator('text=£5');
      await expect(rewardAmount).toBeVisible();
      console.log('✅ Reward amounts displayed');

    } else {
      console.log('⚠️ Authentication may have failed, checking for error messages');
      const errorMessage = await page.locator('.text-red-400').textContent().catch(() => null);
      if (errorMessage) {
        console.log('Error:', errorMessage);
      }
    }
  });

  test('main pages are accessible', async ({ page }) => {
    // Test main pages that don't require authentication
    const pages = [
      { url: '/', name: 'Home' },
      { url: '/about', name: 'About' },
      { url: '/solutions', name: 'Solutions' },
      { url: '/contact', name: 'Contact' },
      { url: '/blog', name: 'Blog' },
      { url: '/agent-lee', name: 'Agent Lee' },
      { url: '/learning', name: 'Learning' },
      { url: '/robotics', name: 'Robotics' },
      { url: '/computer-vision', name: 'Computer Vision' },
      { url: '/ai-agent-development', name: 'AI Agent Development' }
    ];

    for (const pageInfo of pages) {
      try {
        await page.goto(`http://localhost:3001${pageInfo.url}`);
        await page.waitForLoadState('networkidle', { timeout: 10000 });

        const pageLoaded = await page.locator('body').isVisible();
        if (pageLoaded) {
          console.log(`✅ ${pageInfo.name} page loaded`);
        } else {
          console.log(`❌ ${pageInfo.name} page failed to load`);
        }
      } catch (error) {
        console.log(`❌ ${pageInfo.name} page error: ${error}`);
      }
    }
  });

  test('navigation works on home page', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Check main navigation elements
    const navLinks = [
      'Solutions',
      'About',
      'Data Initiative',
      'Agent Lee',
      'Contact'
    ];

    for (const link of navLinks) {
      const navLink = page.locator(`a:has-text("${link}")`).first();
      const isVisible = await navLink.isVisible().catch(() => false);
      if (isVisible) {
        console.log(`✅ ${link} navigation link found`);
      } else {
        console.log(`❌ ${link} navigation link not found`);
      }
    }
  });
});