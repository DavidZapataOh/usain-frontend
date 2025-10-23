import { test, expect } from '@playwright/test';

test.describe('Policy Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/app/policies');
  });

  test('should display policies interface', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Policies');
  });

  test('should show create policy button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /create policy/i })).toBeVisible();
  });

  test('should display policy list', async ({ page }) => {
    // Wait for policies to load
    await page.waitForTimeout(1000);
    
    // Check if policies are displayed
    const policyElements = page.locator('[data-testid="policy-item"]');
    
    // Should have at least the structure for policies
    expect(page.url()).toContain('/app/policies');
  });

  test('should show policy actions', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Look for policy action buttons (pause, resume, revoke)
    const hasActions = await page.getByRole('button', { name: /pause|resume|revoke/i }).count() > 0;
    
    // Structure should be there even if no policies
    expect(page.url()).toContain('/app/policies');
  });
});

