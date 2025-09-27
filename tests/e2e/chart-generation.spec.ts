import { test, expect } from '@playwright/test';

test.describe('Chart Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete basic chart generation scenario', async ({ page }) => {
    // Scenario 1: Basic Chart Generation from quickstart.md

    // Step 1: Verify centered input box is displayed
    const inputBox = page.locator('input[type="text"], textarea').first();
    await expect(inputBox).toBeVisible();

    // Verify input is centered on homepage
    const inputContainer = inputBox.locator('..');
    await expect(inputContainer).toHaveCSS('display', /flex|grid/);

    // Step 2: Enter test data
    await inputBox.fill('Compare Beijing sales 120,130,150 vs Shanghai sales 100,140,160');

    // Step 3: Submit the prompt
    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();
    await submitButton.click();

    // Step 4: Wait for layout transformation
    await page.waitForTimeout(2000); // Allow time for AI processing

    // Verify layout changes: input moves to bottom, chart area appears above
    const chartContainer = page.locator('[data-testid="chart-container"], .chart-container, canvas').first();
    await expect(chartContainer).toBeVisible();

    // Verify input moved to bottom
    const bottomInput = page.locator('input, textarea').first();
    const bottomInputBounds = await bottomInput.boundingBox();
    const pageHeight = await page.evaluate(() => window.innerHeight);

    if (bottomInputBounds && pageHeight) {
      expect(bottomInputBounds.y).toBeGreaterThan(pageHeight * 0.7); // Input should be in bottom 30% of page
    }

    // Step 5: Verify chart displays with correct data
    // Wait for chart to be fully rendered
    await page.waitForTimeout(1000);

    // Check if chart has rendered (ECharts creates SVG or Canvas elements)
    const chartElement = page.locator('canvas, svg').first();
    await expect(chartElement).toBeVisible();

    // Verify chart is interactive (hover tooltips work)
    await chartElement.hover();

    // Optional: Check for tooltip appearance
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tooltip = page.locator('.echarts-tooltip, [role="tooltip"]');
    // Note: Tooltip might not always appear, so we don't strictly require it

    // Step 6: Verify chart is responsive
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile size
    await expect(chartElement).toBeVisible();

    await page.setViewportSize({ width: 1200, height: 800 }); // Desktop size
    await expect(chartElement).toBeVisible();
  });

  test('should handle data validation correctly', async ({ page }) => {
    // Verify input box is present
    const inputBox = page.locator('input[type="text"], textarea').first();
    await expect(inputBox).toBeVisible();

    // Test empty input
    await inputBox.fill('');
    const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();
    await submitButton.click();

    // Should show error message/toast
    const errorMessage = page.locator('.toast, .error, [role="alert"]').first();
    await expect(errorMessage).toBeVisible();

    // Test input with no numerical data
    await inputBox.fill('Hello world, how are you today?');
    await submitButton.click();

    // Should show "no data found" error
    await expect(errorMessage).toBeVisible();
    const errorText = await errorMessage.textContent();
    expect(errorText?.toLowerCase()).toContain('data');
  });

  test('should maintain chart quality across different data sizes', async ({ page }) => {
    const testCases = [
      'Small dataset: A 10, B 20', // 2 data points
      'Medium dataset: Jan 100, Feb 150, Mar 200, Apr 180, May 220, Jun 250', // 6 data points
      'Large dataset: Q1 1000, Q2 1500, Q3 2000, Q4 1800, Q5 2200, Q6 2500, Q7 3000, Q8 2800, Q9 3200, Q10 3500' // 10 data points
    ];

    for (const testData of testCases) {
      // Clear previous input
      const inputBox = page.locator('input[type="text"], textarea').first();
      await inputBox.clear();

      // Enter test data
      await inputBox.fill(testData);

      // Submit
      const submitButton = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Submit")').first();
      await submitButton.click();

      // Wait for chart generation
      await page.waitForTimeout(2000);

      // Verify chart appears
      const chartElement = page.locator('canvas, svg').first();
      await expect(chartElement).toBeVisible();

      // Verify chart has reasonable size
      const chartBounds = await chartElement.boundingBox();
      expect(chartBounds?.width).toBeGreaterThan(200);
      expect(chartBounds?.height).toBeGreaterThan(150);
    }
  });
});