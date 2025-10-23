import { test, expect } from '@playwright/test';

test.describe('Channel Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/app/channel');
  });

  test('should display channel interface', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('State Channel');
    await expect(page.getByText(/status/i)).toBeVisible();
  });

  test('should show channel status', async ({ page }) => {
    // Wait for status to load
    await page.waitForTimeout(1000);
    
    // Check for status indicators
    await expect(page.getByText(/open|closed/i)).toBeVisible();
  });

  test('should display channel actions', async ({ page }) => {
    // Check for action buttons
    const openButton = page.getByRole('button', { name: /open channel/i });
    const closeButton = page.getByRole('button', { name: /close channel/i });
    const settleButton = page.getByRole('button', { name: /settle/i });
    
    // At least one should be visible depending on state
    const hasAction = await openButton.isVisible() || 
                      await closeButton.isVisible() || 
                      await settleButton.isVisible();
    expect(hasAction).toBeTruthy();
  });

  test('should display channel balances', async ({ page }) => {
    await expect(page.getByText(/balance/i)).toBeVisible();
  });
});

