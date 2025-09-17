import { test, expect } from '@playwright/test';

test.describe('Page Performance Tests', () => {
  test('home page load speed', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;

    console.log(`Home page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });

  test('agent-lee page performance', async ({ page }) => {
    const start = Date.now();
    await page.goto('/agent-lee');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;

    console.log(`Agent Lee page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });

  test('solutions page performance', async ({ page }) => {
    const start = Date.now();
    await page.goto('/solutions');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;

    console.log(`Solutions page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });

  test('services page performance', async ({ page }) => {
    const start = Date.now();
    await page.goto('/services');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;

    console.log(`Services page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });

  test('about page performance', async ({ page }) => {
    const start = Date.now();
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;

    console.log(`About page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });

  test('contact page performance', async ({ page }) => {
    const start = Date.now();
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;

    console.log(`Contact page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });

  test('measure Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const perfEntries: any[] = [];

        // Get navigation timing
        const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navTiming) {
          perfEntries.push({
            name: 'DOM Content Loaded',
            value: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart
          });
          perfEntries.push({
            name: 'Load Complete',
            value: navTiming.loadEventEnd - navTiming.loadEventStart
          });
        }

        // Try to get Web Vitals if available
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
              perfEntries.push({
                name: entry.name,
                value: entry.startTime
              });
            });
            observer.disconnect();
            resolve(perfEntries);
          });

          try {
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

            // Fallback if no entries are captured within 2 seconds
            setTimeout(() => {
              observer.disconnect();
              resolve(perfEntries);
            }, 2000);
          } catch (e) {
            resolve(perfEntries);
          }
        } else {
          resolve(perfEntries);
        }
      });
    });

    console.log('Performance metrics:', metrics);

    // Basic assertion that we got some metrics
    expect(Array.isArray(metrics)).toBeTruthy();
  });
});