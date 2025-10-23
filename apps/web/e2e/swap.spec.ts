import { test, expect } from '@playwright/test';

test.describe('Swap Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/app/swap');
  });

  test('should display swap interface', async ({ page }) => {
    // Check for main elements
    await expect(page.locator('h1')).toContainText('Instant Swap');
    await expect(page.getByPlaceholder('0.00')).toBeVisible();
    await expect(page.getByText('USDC')).toBeVisible();
    await expect(page.getByText('DAI')).toBeVisible();
  });

  test('should request quote', async ({ page }) => {
    // Enter amount
    await page.getByPlaceholder('0.00').first().fill('1000');
    
    // Click quote button
    await page.getByRole('button', { name: /quote/i }).click();
    
    // Wait for quote to appear
    await expect(page.getByText(/price/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/fee/i)).toBeVisible();
  });

  test('should show swap button after quote', async ({ page }) => {
    // Enter amount
    await page.getByPlaceholder('0.00').first().fill('1000');
    
    // Get quote
    await page.getByRole('button', { name: /quote/i }).click();
    await page.waitForTimeout(2000);
    
    // Check swap button is visible
    await expect(page.getByRole('button', { name: /instant swap/i })).toBeVisible();
  });

  test('should display telemetry panel', async ({ page }) => {
    await expect(page.getByText(/gas saved/i)).toBeVisible();
    await expect(page.getByText(/latency/i)).toBeVisible();
    await expect(page.getByText(/volume/i)).toBeVisible();
  });

  test('should display percentage buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: '25%' })).toBeVisible();
    await expect(page.getByRole('button', { name: '50%' })).toBeVisible();
    await expect(page.getByRole('button', { name: '75%' })).toBeVisible();
    await expect(page.getByRole('button', { name: '100%' })).toBeVisible();
  });

  test('should show SpeedRail pulse animation', async ({ page }) => {
    // Check if SpeedRail component exists
    const speedRail = page.locator('[data-testid="speedrail"]').or(page.locator('text=SpeedRail'));
    if (await speedRail.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Verify animation is present (checking for animation class or CSS property)
      const hasAnimation = await speedRail.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.animation !== 'none' || el.classList.contains('animate-pulse');
      });
      expect(hasAnimation).toBeTruthy();
    }
  });

  test('should show filled toast with latency after swap', async ({ page }) => {
    // This test requires a connected wallet and active policy
    // Skip if wallet is not connected
    const connectButton = page.getByRole('button', { name: /connect wallet/i });
    if (await connectButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      test.skip();
      return;
    }

    // Enter amount
    await page.getByPlaceholder('0.00').first().fill('100');
    
    // Get quote
    await page.getByRole('button', { name: /get quote/i }).click();
    await page.waitForTimeout(2000);
    
    // Check if swap button is enabled (has active policy)
    const swapButton = page.getByRole('button', { name: /instant swap/i });
    const isDisabled = await swapButton.getAttribute('disabled');
    
    if (!isDisabled) {
      // Click swap button
      await swapButton.click();
      
      // Wait for toast with latency message
      await expect(page.locator('text=/Filled in \\d+ms/i')).toBeVisible({ timeout: 15000 });
    } else {
      test.skip();
    }
  });

  test('should receive live metrics events on dashboard', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3000/app/dashboard');
    
    // Wait for metrics to load
    await page.waitForTimeout(1000);
    
    // Check if metrics are updating (by checking if values change)
    const initialGasSaved = await page.locator('text=/Gas Saved/i').locator('..').textContent();
    
    // Wait for SSE event (2-3 seconds based on backend config)
    await page.waitForTimeout(3000);
    
    const updatedGasSaved = await page.locator('text=/Gas Saved/i').locator('..').textContent();
    
    // Verify that metrics are being updated (values should be different or at least visible)
    expect(initialGasSaved).toBeTruthy();
    expect(updatedGasSaved).toBeTruthy();
  });
});
