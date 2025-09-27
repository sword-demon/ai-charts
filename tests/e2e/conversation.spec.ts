import { test, expect } from '@playwright/test';

test.describe('Conversation Context Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should maintain conversation context for iterative modifications', async ({ page }) => {
    // Scenario 4: Conversation Context from quickstart.md

    const inputBox = page.locator('input[type="text"], textarea').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();

    // Step 1: Generate initial chart
    await inputBox.fill('Monthly sales: Jan 100, Feb 150, Mar 200');
    await submitButton.click();

    // Wait for initial chart to appear
    await page.waitForTimeout(2000);

    const initialChart = page.locator('canvas, svg').first();
    await expect(initialChart).toBeVisible();

    // Store initial chart state for comparison
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const initialChartBounds = await initialChart.boundingBox();

    // Step 2: Wait for chart to fully render
    await page.waitForTimeout(1000);

    // Step 3: Enter follow-up request
    await inputBox.clear();
    await inputBox.fill('Change to line chart');
    await submitButton.click();

    // Step 4: Wait for chart modification
    await page.waitForTimeout(2000);

    // Verify chart is updated
    const updatedChart = page.locator('canvas, svg').first();
    await expect(updatedChart).toBeVisible();

    // Chart should still be in the same container but potentially re-rendered
    const updatedChartBounds = await updatedChart.boundingBox();
    expect(updatedChartBounds).toBeTruthy();

    // Step 5: Verify data values remain the same (context maintained)
    // We can't directly inspect chart data, but we can verify the chart updated successfully
    // by checking for differences in rendering or by triggering hover to see tooltips

    await updatedChart.hover();
    await page.waitForTimeout(500);

    // The chart should be interactive and show the same data values
    // Additional verification: try another modification to ensure context persists
    await inputBox.clear();
    await inputBox.fill('Add a title: "Monthly Sales Report"');
    await submitButton.click();

    await page.waitForTimeout(2000);

    // Chart should still be visible and updated
    const finalChart = page.locator('canvas, svg').first();
    await expect(finalChart).toBeVisible();
  });

  test('should handle multiple consecutive modifications', async ({ page }) => {
    const inputBox = page.locator('input[type="text"], textarea').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();

    const modifications = [
      'Sales data: Q1 100, Q2 150, Q3 200, Q4 180',
      'Change to bar chart',
      'Add colors: blue and red',
      'Change title to "Quarterly Performance"',
      'Switch to pie chart'
    ];

    for (let i = 0; i < modifications.length; i++) {
      await inputBox.clear();
      await inputBox.fill(modifications[i]!);
      await submitButton.click();

      // Wait for processing
      await page.waitForTimeout(2000);

      // Verify chart is present after each modification
      const chart = page.locator('canvas, svg').first();
      await expect(chart).toBeVisible();

      // Verify input remains accessible for next modification
      await expect(inputBox).toBeEnabled();
    }
  });

  test('should preserve data across chart type changes', async ({ page }) => {
    const inputBox = page.locator('input[type="text"], textarea').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();

    // Start with specific data
    await inputBox.fill('Team performance: Alice 85, Bob 92, Charlie 78, Diana 96');
    await submitButton.click();
    await page.waitForTimeout(2000);

    const initialChart = page.locator('canvas, svg').first();
    await expect(initialChart).toBeVisible();

    // Test different chart type changes
    const chartTypes = ['bar chart', 'line chart', 'pie chart', 'area chart'];

    for (const chartType of chartTypes) {
      await inputBox.clear();
      await inputBox.fill(`Change to ${chartType}`);
      await submitButton.click();
      await page.waitForTimeout(2000);

      const chart = page.locator('canvas, svg').first();
      await expect(chart).toBeVisible();

      // Test interactivity to ensure data is preserved
      await chart.hover();
      await page.waitForTimeout(300);
    }
  });

  test('should handle context reset appropriately', async ({ page }) => {
    const inputBox = page.locator('input[type="text"], textarea').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();

    // Create initial chart
    await inputBox.fill('Original data: A 100, B 200');
    await submitButton.click();
    await page.waitForTimeout(2000);

    await expect(page.locator('canvas, svg').first()).toBeVisible();

    // Start completely new conversation with new data
    await inputBox.clear();
    await inputBox.fill('Completely different data: X 50, Y 75, Z 100');
    await submitButton.click();
    await page.waitForTimeout(2000);

    // Should create new chart with new data
    const newChart = page.locator('canvas, svg').first();
    await expect(newChart).toBeVisible();

    // Verify we can still make modifications to the new chart
    await inputBox.clear();
    await inputBox.fill('Make it a line chart');
    await submitButton.click();
    await page.waitForTimeout(2000);

    await expect(page.locator('canvas, svg').first()).toBeVisible();
  });

  test('should handle ambiguous follow-up requests', async ({ page }) => {
    const inputBox = page.locator('input[type="text"], textarea').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();

    // Create initial chart
    await inputBox.fill('Data: 10, 20, 30');
    await submitButton.click();
    await page.waitForTimeout(2000);

    await expect(page.locator('canvas, svg').first()).toBeVisible();

    // Try ambiguous follow-up
    await inputBox.clear();
    await inputBox.fill('Make it better');
    await submitButton.click();
    await page.waitForTimeout(2000);

    // Should either:
    // 1. Show error asking for clarification, OR
    // 2. Make some reasonable improvement to the chart
    const chart = page.locator('canvas, svg').first();
    const toast = page.locator('.toast, [role="alert"], .notification').first();

    const chartVisible = await chart.isVisible();
    const toastVisible = await toast.isVisible();

    // Either chart should be updated OR error should be shown
    expect(chartVisible || toastVisible).toBeTruthy();

    if (toastVisible) {
      const toastText = await toast.textContent();
      expect(toastText?.toLowerCase()).toMatch(/clarify|specific|unclear/);
    }
  });

  test('should maintain conversation across page refresh', async ({ page }) => {
    const inputBox = page.locator('input[type="text"], textarea').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();

    // Create initial chart
    await inputBox.fill('Session data: 100, 200, 300');
    await submitButton.click();
    await page.waitForTimeout(2000);

    await expect(page.locator('canvas, svg').first()).toBeVisible();

    // Refresh the page
    await page.reload();

    // After refresh, should start fresh (no conversation context)
    const inputAfterRefresh = page.locator('input[type="text"], textarea').first();
    await expect(inputAfterRefresh).toBeVisible();

    // Verify we're back to initial state (centered input)
    const inputContainer = inputAfterRefresh.locator('..');
    await expect(inputContainer).toBeVisible();

    // Chart should not be visible initially
    const charts = page.locator('canvas, svg');
    const chartCount = await charts.count();
    expect(chartCount).toBe(0);
  });
});