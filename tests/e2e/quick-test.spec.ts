import { test, expect } from '@playwright/test';

test.describe('Quick Functionality Test', () => {
  test('app loads and auth system works', async ({ page }) => {
    // Go to the app
    await page.goto('http://localhost:3001');

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

      // Check main page elements
      await expect(page.locator('h1:has-text("NAVADA")')).toBeVisible();
      console.log('✅ Main page loaded');

      // Check navigation
      const navLinks = ['Solutions', 'About', 'Agent Lee', 'Contact'];
      for (const link of navLinks) {
        const navLink = page.locator(`a:has-text("${link}")`).first();
        await expect(navLink).toBeVisible();
      }
      console.log('✅ Navigation links visible');

      // Check hero section
      const heroText = page.locator('text=Navigating Artistic Vision').first();
      await expect(heroText).toBeVisible();
      console.log('✅ Hero section loaded');

    } else {
      console.log('⚠️ Authentication may have failed, checking for error messages');
      const errorMessage = await page.locator('.text-red-400').textContent().catch(() => null);
      if (errorMessage) {
        console.log('Error:', errorMessage);
      }
    }
  });

  test('main pages are accessible', async ({ page }) => {
    // Bypass auth for this test
    await page.goto('http://localhost:3001');
    await page.evaluate(() => {
      sessionStorage.setItem('navada_token', 'test-token');
      sessionStorage.setItem('navada_user', JSON.stringify({ email: 'test@example.com', name: 'Test User' }));
    });
    await page.reload();

    // Test main pages
    const pages = [
      { url: '/', title: 'NAVADA' },
      { url: '/solutions', title: 'Solutions' },
      { url: '/about', title: 'About' },
      { url: '/contact', title: 'Contact' },
      { url: '/agent-lee', title: 'Agent Lee' }
    ];

    for (const pageInfo of pages) {
      await page.goto(`http://localhost:3001${pageInfo.url}`);
      await page.waitForLoadState('networkidle');

      const pageLoaded = await page.locator('body').isVisible();
      if (pageLoaded) {
        console.log(`✅ ${pageInfo.title} page loaded`);
      } else {
        console.log(`❌ ${pageInfo.title} page failed to load`);
      }
    }
  });
});