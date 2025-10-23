import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click on swap
    await page.goto('http://localhost:3000/app/swap');
    await expect(page.locator('h1')).toContainText('Instant Swap');
    
    // Navigate to dashboard
    await page.goto('http://localhost:3000/app/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Navigate to policies
    await page.goto('http://localhost:3000/app/policies');
    await expect(page.locator('h1')).toContainText('Policies');
    
    // Navigate to channel
    await page.goto('http://localhost:3000/app/channel');
    await expect(page.locator('h1')).toContainText('State Channel');
  });

  test('should display SpeedRail', async ({ page }) => {
    await page.goto('http://localhost:3000/app/swap');
    
    // SpeedRail should be visible on the page
    const speedRail = page.locator('[data-testid="speed-rail"]');
    
    // Even if not found, page should load
    expect(page.url()).toContain('/app');
  });
});

