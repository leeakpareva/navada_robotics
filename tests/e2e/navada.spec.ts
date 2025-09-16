import { test, expect } from '@playwright/test';

test.describe('NAVADA Robotics Homepage', () => {
  test('homepage loads with correct title and main elements', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle('NAVADA Robotics | AI & Robotics Innovation');

    // Check main heading is visible
    const mainHeading = page.locator('h1:has-text("NAVADA")');
    await expect(mainHeading).toBeVisible();

    // Check hero section headline
    const heroHeadline = page.locator('h2:has-text("Navigating Artistic Vision with Advanced Digital Assistance")');
    await expect(heroHeadline).toBeVisible();

    // Check navigation links are present
    const navLinks = ['Solutions', 'News', 'About', 'Analytics', 'Agent Lee', 'Contact'];
    for (const linkText of navLinks) {
      const link = page.locator(`a:has-text("${linkText}")`).first();
      await expect(link).toBeVisible();
    }

    // Check CTA buttons
    const exploreButton = page.locator('text=Explore Innovation').first();
    await expect(exploreButton).toBeVisible();

    const visionButton = page.locator('text=My Vision').first();
    await expect(visionButton).toBeVisible();
  });

  test('innovation showcase section is visible', async ({ page }) => {
    await page.goto('/');

    // Check Innovation Showcase section
    const showcaseTitle = page.locator('h3:has-text("Innovation Showcase")');
    await expect(showcaseTitle).toBeVisible();

    // Check showcase cards are present
    const showcaseCards = [
      'AI Creative Assistant',
      'Next-Gen Automation',
      'Research Platform'
    ];

    for (const cardTitle of showcaseCards) {
      const card = page.locator(`h4:has-text("${cardTitle}")`);
      await expect(card).toBeVisible();
    }
  });

  test('active projects section is visible', async ({ page }) => {
    await page.goto('/');

    // Check Active Projects section
    const projectsTitle = page.locator('h3:has-text("Active Projects")');
    await expect(projectsTitle).toBeVisible();

    // Check project cards
    const projectCards = [
      'Robotics',
      'AI Agent Development',
      'Computer Vision'
    ];

    for (const projectTitle of projectCards) {
      const card = page.locator(`h4:has-text("${projectTitle}")`);
      await expect(card).toBeVisible();
    }
  });

  test('mobile menu toggle works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu should be hidden initially
    const mobileNav = page.locator('nav.flex.flex-col').first();
    await expect(mobileNav).toBeHidden();

    // Click menu button
    const menuButton = page.locator('button:has(svg)').first();
    await menuButton.click();

    // Mobile menu should now be visible
    await expect(mobileNav).toBeVisible();

    // Click again to close
    await menuButton.click();
    await expect(mobileNav).toBeHidden();
  });

  test('footer contains correct information', async ({ page }) => {
    await page.goto('/');

    // Check footer text
    const footerText = page.locator('footer');
    await expect(footerText).toContainText('© 2024 NAVADA. All rights reserved.');
    await expect(footerText).toContainText('Navigating Artistic Vision with Advanced Digital Assistance');
    await expect(footerText).toContainText('Designed & Developed by Lee Akpareva MBA, MA');
  });
});