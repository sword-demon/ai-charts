import { test, expect } from '@playwright/test';

test.describe('Error Handling Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle empty input with toast notification', async ({ page }) => {
    // Scenario 3: Error Handling from quickstart.md

    // Step 1: Enter empty string and submit
    const inputBox = page.locator('input[type="text"], textarea').first();
    await expect(inputBox).toBeVisible();

    await inputBox.fill('');

    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();
    await submitButton.click();

    // Step 2: Verify toast notification appears
    const toast = page.locator('.toast, [role="alert"], .notification').first();
    await expect(toast).toBeVisible();

    // Verify error message is user-friendly
    const toastText = await toast.textContent();
    expect(toastText?.toLowerCase()).toContain('data');

    // Step 3: Verify input box remains accessible
    await expect(inputBox).toBeVisible();
    await expect(inputBox).toBeEnabled();

    // Step 4: Verify no broken chart displays
    const chartContainer = page.locator('[data-testid="chart-container"], .chart-container');
    const chartExists = await chartContainer.count();

    if (chartExists > 0) {
      // If chart container exists, it should not show error state
      const errorInChart = page.locator('.error, .chart-error').first();
      const hasError = await errorInChart.count();
      expect(hasError).toBe(0);
    }
  });

  test('should handle no-data input with appropriate message', async ({ page }) => {
    const inputBox = page.locator('input[type="text"], textarea').first();

    // Step 1: Enter text with no numerical data
    await inputBox.fill('Hello world');

    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();
    await submitButton.click();

    // Step 2: Wait for processing
    await page.waitForTimeout(1000);

    // Step 3: Verify error toast appears
    const toast = page.locator('.toast, [role="alert"], .notification').first();
    await expect(toast).toBeVisible();

    // Verify specific error message for no data
    const toastText = await toast.textContent();
    expect(toastText?.toLowerCase()).toMatch(/no.*data|data.*not.*found|invalid.*data/);

    // Step 4: Verify UI remains functional
    await expect(inputBox).toBeEnabled();
  });

  test('should handle invalid data gracefully', async ({ page }) => {
    const invalidInputs = [
      'Show chart for invalid data xyz abc',
      'Numbers: abc def ghi',
      'Chart with symbols: !@#$%^&*()',
      'Mixed invalid: some 123 text abc 456 more text'
    ];

    for (const invalidInput of invalidInputs) {
      const inputBox = page.locator('input[type="text"], textarea').first();

      // Clear previous input
      await inputBox.clear();

      // Enter invalid data
      await inputBox.fill(invalidInput);

      const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();
      await submitButton.click();

      // Wait for processing
      await page.waitForTimeout(1500);

      // Should either show error toast or generate chart with available data
      const toast = page.locator('.toast, [role="alert"], .notification').first();
      const chart = page.locator('canvas, svg').first();

      // Either error message OR chart should appear, not both
      const toastVisible = await toast.isVisible();
      const chartVisible = await chart.isVisible();

      // At least one should be true (error OR success)
      expect(toastVisible || chartVisible).toBeTruthy();

      // If error appears, input should remain accessible
      if (toastVisible) {
        await expect(inputBox).toBeEnabled();
      }
    }
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure by intercepting API calls
    await page.route('/api/chat', route => {
      route.abort('failed');
    });

    const inputBox = page.locator('input[type="text"], textarea').first();
    await inputBox.fill('Test data: 100, 200, 300');

    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();
    await submitButton.click();

    // Wait for error handling
    await page.waitForTimeout(2000);

    // Should show error message
    const toast = page.locator('.toast, [role="alert"], .notification').first();
    await expect(toast).toBeVisible();

    const toastText = await toast.textContent();
    expect(toastText?.toLowerCase()).toMatch(/error|failed|try.*again|network/);

    // Input should remain functional
    await expect(inputBox).toBeEnabled();
  });

  test('should handle AI processing timeout', async ({ page }) => {
    // Simulate slow API response
    await page.route('/api/chat', route => {
      setTimeout(() => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'TIMEOUT',
            message: 'AI processing timeout. Please try again.'
          })
        });
      }, 100);
    });

    const inputBox = page.locator('input[type="text"], textarea').first();
    await inputBox.fill('Complex data: 100, 200, 300, 400, 500');

    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();
    await submitButton.click();

    // Wait for timeout handling
    await page.waitForTimeout(3000);

    // Should show timeout error
    const toast = page.locator('.toast, [role="alert"], .notification').first();
    await expect(toast).toBeVisible();

    const toastText = await toast.textContent();
    expect(toastText?.toLowerCase()).toMatch(/timeout|try.*again|processing/);
  });

  test('should recover from errors and continue working', async ({ page }) => {
    const inputBox = page.locator('input[type="text"], textarea').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();

    // Step 1: Cause an error
    await inputBox.fill(''); // Empty input
    await submitButton.click();

    // Wait for error
    const toast = page.locator('.toast, [role="alert"], .notification').first();
    await expect(toast).toBeVisible();

    // Step 2: Dismiss error and try valid input
    // Clear input and try again
    await inputBox.fill('Valid data: 100, 200, 300');
    await submitButton.click();

    // Step 3: Should work normally now
    await page.waitForTimeout(2000);

    const chart = page.locator('canvas, svg').first();
    await expect(chart).toBeVisible();

    // Verify previous error is cleared
    const newToast = page.locator('.toast, [role="alert"], .notification').first();
    const isNewToastVisible = await newToast.isVisible();

    if (isNewToastVisible) {
      const newToastText = await newToast.textContent();
      // If toast is visible, it should be success, not error
      expect(newToastText?.toLowerCase()).not.toMatch(/error|failed/);
    }
  });
});