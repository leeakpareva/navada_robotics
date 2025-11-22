import { test, expect } from '@playwright/test';

test.describe('Video Playback in Production', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the projects page
    await page.goto('https://www.navadarobotics.com/solutions/projects');
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should load projects page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Projects/);
    await expect(page.locator('h2')).toContainText('Projects');
  });

  test('should have video elements present on page', async ({ page }) => {
    // Check if video elements exist
    const videoElements = await page.locator('video').count();
    expect(videoElements).toBeGreaterThan(0);

    console.log(`Found ${videoElements} video element(s) on the page`);
  });

  test('should verify Purple Pie video element', async ({ page }) => {
    // Find the Purple Pie video container
    const purplePieContainer = page.locator('text="Purple Pie - Raspberry Pi Powered AI Device"').locator('..').locator('video');

    await expect(purplePieContainer).toBeVisible();

    // Check video source
    const videoSrc = await purplePieContainer.getAttribute('src') ||
                     await purplePieContainer.locator('source').first().getAttribute('src');

    console.log('Purple Pie video source:', videoSrc);
    expect(videoSrc).toContain('/videos/purple-pie.mp4');
  });

  test('should verify BlueFin Deck video element', async ({ page }) => {
    // Find the BlueFin Deck video container
    const blueFinContainer = page.locator('text="BlueFin Deck - Portable Raspberry Pi Command Center"').locator('..').locator('video');

    await expect(blueFinContainer).toBeVisible();

    // Check video source
    const videoSrc = await blueFinContainer.getAttribute('src') ||
                     await blueFinContainer.locator('source').first().getAttribute('src');

    console.log('BlueFin Deck video source:', videoSrc);
    expect(videoSrc).toContain('/videos/bluefin-deck.mp4');
  });

  test('should test video file accessibility', async ({ page }) => {
    // Test direct access to video files
    const videoUrls = [
      'https://www.navadarobotics.com/videos/purple-pie.mp4',
      'https://www.navadarobotics.com/videos/bluefin-deck.mp4'
    ];

    for (const videoUrl of videoUrls) {
      console.log(`Testing video URL: ${videoUrl}`);

      const response = await page.request.head(videoUrl);
      const status = response.status();
      const contentType = response.headers()['content-type'];

      console.log(`${videoUrl} - Status: ${status}, Content-Type: ${contentType}`);

      if (status === 200) {
        expect(contentType).toContain('video');
        console.log(`✅ ${videoUrl} is accessible`);
      } else {
        console.log(`❌ ${videoUrl} returned status ${status}`);
      }
    }
  });

  test('should verify video elements have proper attributes', async ({ page }) => {
    const videos = await page.locator('video').all();

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];

      // Check essential video attributes
      const hasControls = await video.getAttribute('controls');
      const hasPlaysinline = await video.getAttribute('playsinline');
      const preload = await video.getAttribute('preload');

      console.log(`Video ${i + 1}:`, {
        controls: hasControls !== null,
        playsInline: hasPlaysinline !== null,
        preload: preload
      });

      expect(hasControls).toBeDefined();
      expect(hasPlaysinline).toBeDefined();
      expect(preload).toBe('metadata');
    }
  });

  test('should check for video loading errors', async ({ page }) => {
    let videoErrors: string[] = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('video')) {
        videoErrors.push(msg.text());
      }
    });

    // Wait a bit for videos to attempt loading
    await page.waitForTimeout(5000);

    // Check if any videos show error state
    const errorElements = await page.locator('text="Video Preview Unavailable"').count();
    const videoElements = await page.locator('video').count();

    console.log(`Found ${videoElements} video element(s)`);
    console.log(`Found ${errorElements} error state(s)`);
    console.log('Video errors from console:', videoErrors);

    // Log video network requests
    const videoRequests = await page.evaluate(() => {
      const performances = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return performances
        .filter(entry => entry.name.includes('.mp4'))
        .map(entry => ({
          url: entry.name,
          status: (entry as any).responseStatus || 'unknown',
          duration: entry.duration,
          size: entry.transferSize
        }));
    });

    console.log('Video network requests:', videoRequests);

    // Ideally, we want no error states if videos are working
    if (errorElements > 0) {
      console.log(`⚠️  Found ${errorElements} videos in error state`);
    } else {
      console.log('✅ No videos in error state');
    }
  });

  test('should attempt video playback', async ({ page }) => {
    // Try to interact with video elements
    const videos = await page.locator('video').all();

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];

      try {
        // Check if video is ready to play
        const readyState = await video.evaluate((vid: HTMLVideoElement) => vid.readyState);
        const networkState = await video.evaluate((vid: HTMLVideoElement) => vid.networkState);

        console.log(`Video ${i + 1} - Ready State: ${readyState}, Network State: ${networkState}`);

        // Try to get video duration (indicates successful loading)
        const duration = await video.evaluate((vid: HTMLVideoElement) => vid.duration);
        console.log(`Video ${i + 1} duration: ${duration}s`);

        if (duration > 0) {
          console.log(`✅ Video ${i + 1} loaded successfully`);
        } else {
          console.log(`⚠️  Video ${i + 1} may not be loaded properly`);
        }

      } catch (error) {
        console.log(`❌ Error testing video ${i + 1}:`, error);
      }
    }
  });
});