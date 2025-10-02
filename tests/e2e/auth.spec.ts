import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear session storage before each test
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.clear();
    });
  });

  test('authentication modal appears on first visit', async ({ page }) => {
    await page.goto('/');

    // Check auth modal is visible
    const authModal = page.locator('div:has(h1:has-text("NAVADA"))');
    await expect(authModal).toBeVisible();

    // Check tabs are visible
    const loginTab = page.locator('button:has-text("Login")');
    const signUpTab = page.locator('button:has-text("Sign Up")');
    await expect(loginTab).toBeVisible();
    await expect(signUpTab).toBeVisible();
  });

  test('can switch between login and signup tabs', async ({ page }) => {
    await page.goto('/');

    const loginTab = page.locator('button:has-text("Login")');
    const signUpTab = page.locator('button:has-text("Sign Up")');

    // Initially on login tab
    await expect(page.locator('label:has-text("Email")').first()).toBeVisible();
    await expect(page.locator('label:has-text("Password")').first()).toBeVisible();

    // Switch to signup tab
    await signUpTab.click();
    await expect(page.locator('label:has-text("Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Confirm Password")')).toBeVisible();

    // Switch back to login
    await loginTab.click();
    await expect(page.locator('label:has-text("Confirm Password")')).not.toBeVisible();
  });

  test('signup flow with validation', async ({ page }) => {
    await page.goto('/');

    // Switch to signup tab
    const signUpTab = page.locator('button:has-text("Sign Up")');
    await signUpTab.click();

    // Try to submit empty form
    const signupButton = page.locator('button:has-text("Sign Up")').last();
    await signupButton.click();

    // Fill in the form with invalid password
    await page.fill('input[id="signup-name"]', 'Test User');
    await page.fill('input[id="signup-email"]', 'test@example.com');
    await page.fill('input[id="signup-password"]', '123');
    await page.fill('input[id="confirm-password"]', '123');
    await signupButton.click();

    // Check for password length error
    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();

    // Fill with mismatched passwords
    await page.fill('input[id="signup-password"]', '123456');
    await page.fill('input[id="confirm-password"]', '123457');
    await signupButton.click();

    // Check for password mismatch error
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('can create account and login', async ({ page }) => {
    await page.goto('/');

    // Generate unique email for this test
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'Test123456';

    // Switch to signup tab
    const signUpTab = page.locator('button:has-text("Sign Up")');
    await signUpTab.click();

    // Fill signup form
    await page.fill('input[id="signup-name"]', 'Test User');
    await page.fill('input[id="signup-email"]', testEmail);
    await page.fill('input[id="signup-password"]', testPassword);
    await page.fill('input[id="confirm-password"]', testPassword);

    // Submit signup form
    const signupButton = page.locator('button:has-text("Sign Up")').last();
    await signupButton.click();

    // Should redirect to homepage after successful signup
    await page.waitForLoadState('networkidle');

    // Check that the auth modal is gone and main content is visible
    const authModal = page.locator('div:has(h1:has-text("NAVADA"))').first();
    await expect(authModal).not.toHaveClass(/fixed inset-0/);

    // Verify main navigation is visible
    const mainNav = page.locator('nav').first();
    await expect(mainNav).toBeVisible();

    // Clear session and try to login
    await page.evaluate(() => {
      sessionStorage.clear();
    });
    await page.reload();

    // Login with created account
    await page.fill('input[id="login-email"]', testEmail);
    await page.fill('input[id="login-password"]', testPassword);

    const loginButton = page.locator('button:has-text("Login")').last();
    await loginButton.click();

    await page.waitForLoadState('networkidle');

    // Should be logged in and see main content
    await expect(mainNav).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/');

    // Try to login with invalid credentials
    await page.fill('input[id="login-email"]', 'invalid@example.com');
    await page.fill('input[id="login-password"]', 'wrongpassword');

    const loginButton = page.locator('button:has-text("Login")').last();
    await loginButton.click();

    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('password visibility toggle works', async ({ page }) => {
    await page.goto('/');

    const passwordInput = page.locator('input[id="login-password"]');
    const toggleButton = page.locator('button').filter({ has: page.locator('svg') }).last();

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('authenticated user bypasses auth modal on refresh', async ({ page }) => {
    await page.goto('/');

    // Create and login with test account
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'Test123456';

    // Sign up
    const signUpTab = page.locator('button:has-text("Sign Up")');
    await signUpTab.click();

    await page.fill('input[id="signup-name"]', 'Test User');
    await page.fill('input[id="signup-email"]', testEmail);
    await page.fill('input[id="signup-password"]', testPassword);
    await page.fill('input[id="confirm-password"]', testPassword);

    const signupButton = page.locator('button:has-text("Sign Up")').last();
    await signupButton.click();

    await page.waitForLoadState('networkidle');

    // Refresh page
    await page.reload();

    // Should still be authenticated and not see auth modal
    const authModal = page.locator('div.fixed.inset-0.z-\\[9999\\]');
    await expect(authModal).not.toBeVisible();

    // Main navigation should be visible
    const mainNav = page.locator('nav').first();
    await expect(mainNav).toBeVisible();
  });
});