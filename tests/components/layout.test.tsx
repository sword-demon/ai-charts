import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Import will fail until component is implemented - this is expected for TDD
import HomePage from '@/app/page';

// Mock the ChartRenderer component
jest.mock('@/app/components/charts/chart-renderer', () => ({
  ChartRenderer: ({ chartConfig, isLoading }: { chartConfig: Record<string, unknown>; isLoading: boolean }) => (
    <div data-testid="chart-renderer">
      {isLoading ? 'Loading chart...' : 'Chart rendered'}
      {chartConfig && <div data-testid="chart-data">{JSON.stringify(chartConfig)}</div>}
    </div>
  ),
}));

// Mock the API calls
global.fetch = jest.fn();

describe('Layout Transformation', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should start with centered input layout', () => {
    render(<HomePage />);

    // Should have centered input box initially
    const inputBox = screen.getByRole('textbox');
    expect(inputBox).toBeInTheDocument();

    // Input should be in center layout (not bottom)
    const inputContainer = inputBox.closest('[data-testid*="input"], [class*="center"], [class*="flex"]');
    expect(inputContainer).toBeInTheDocument();

    // Chart area should not be visible initially
    const chartRenderer = screen.queryByTestId('chart-renderer');
    expect(chartRenderer).not.toBeInTheDocument();
  });

  it('should transform layout after successful chart generation', async () => {
    const user = userEvent.setup();

    // Mock successful API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        chartConfig: {
          title: { text: 'Test Chart' },
          series: [{ name: 'Data', type: 'bar', data: [100, 200] }]
        },
        conversationId: 'test-id',
        message: 'Chart generated successfully'
      })
    });

    render(<HomePage />);

    const inputBox = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button');

    // Enter data and submit
    await user.type(inputBox, 'Test data: 100, 200');
    await user.click(submitButton);

    // Wait for layout transformation
    await waitFor(async () => {
      const chartRenderer = screen.getByTestId('chart-renderer');
      expect(chartRenderer).toBeInTheDocument();
    });

    // Verify layout has changed
    // Input should now be at bottom
    const bottomInput = screen.getByRole('textbox');
    expect(bottomInput).toBeInTheDocument();

    // Chart area should be visible above input
    const chartArea = screen.getByTestId('chart-renderer');
    expect(chartArea).toBeInTheDocument();

    // Verify chart received correct data
    const chartData = screen.getByTestId('chart-data');
    expect(chartData).toHaveTextContent('Test Chart');
  });

  it('should maintain bottom layout after chart generation', async () => {
    const user = userEvent.setup();

    // Mock first API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        chartConfig: {
          title: { text: 'First Chart' },
          series: [{ name: 'Data', type: 'bar', data: [100, 200] }]
        },
        conversationId: 'test-id-1'
      })
    });

    render(<HomePage />);

    // Generate first chart
    const inputBox = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button');

    await user.type(inputBox, 'First chart: 100, 200');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('chart-renderer')).toBeInTheDocument();
    });

    // Mock second API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        chartConfig: {
          title: { text: 'Second Chart' },
          series: [{ name: 'Data', type: 'line', data: [150, 250] }]
        },
        conversationId: 'test-id-1'
      })
    });

    // Clear input and enter new data
    await user.clear(inputBox);
    await user.type(inputBox, 'Second chart: 150, 250');
    await user.click(submitButton);

    await waitFor(() => {
      const chartData = screen.getByTestId('chart-data');
      expect(chartData).toHaveTextContent('Second Chart');
    });

    // Layout should remain in bottom-input, top-chart configuration
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByTestId('chart-renderer')).toBeInTheDocument();
  });

  it('should handle loading states during layout transformation', async () => {
    const user = userEvent.setup();

    // Mock delayed API response
    let resolvePromise: (value: Record<string, unknown>) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (fetch as jest.Mock).mockReturnValueOnce({
      ok: true,
      json: () => delayedPromise
    });

    render(<HomePage />);

    const inputBox = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button');

    await user.type(inputBox, 'Loading test: 100, 200');
    await user.click(submitButton);

    // Should show loading state
    await waitFor(() => {
      const chartRenderer = screen.getByTestId('chart-renderer');
      expect(chartRenderer).toBeInTheDocument();
      expect(chartRenderer).toHaveTextContent('Loading chart...');
    });

    // Input should be disabled during loading
    expect(inputBox).toBeDisabled();

    // Resolve the promise
    resolvePromise({
      success: true,
      chartConfig: {
        title: { text: 'Loaded Chart' },
        series: [{ name: 'Data', type: 'bar', data: [100, 200] }]
      },
      conversationId: 'test-id'
    });

    // Should show completed chart
    await waitFor(() => {
      const chartRenderer = screen.getByTestId('chart-renderer');
      expect(chartRenderer).toHaveTextContent('Chart rendered');
    });

    // Input should be enabled again
    expect(inputBox).toBeEnabled();
  });

  it('should not transform layout on error', async () => {
    const user = userEvent.setup();

    // Mock error response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: 'NO_DATA_FOUND',
        message: 'No data found in your prompt'
      })
    });

    render(<HomePage />);

    const inputBox = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button');

    await user.type(inputBox, 'Invalid input');
    await user.click(submitButton);

    // Wait for error handling
    await waitFor(() => {
      // Should show error message (toast or inline)
      const errorMessage = screen.getByText(/no data found|error/i);
      expect(errorMessage).toBeInTheDocument();
    });

    // Layout should remain in center configuration
    expect(inputBox).toBeInTheDocument();

    // Chart should not appear
    const chartRenderer = screen.queryByTestId('chart-renderer');
    expect(chartRenderer).not.toBeInTheDocument();
  });

  it('should be responsive across different screen sizes', async () => {
    const user = userEvent.setup();

    // Mock successful response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        chartConfig: {
          title: { text: 'Responsive Chart' },
          series: [{ name: 'Data', type: 'bar', data: [100, 200] }]
        },
        conversationId: 'test-id'
      })
    });

    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 375 });
    Object.defineProperty(window, 'innerHeight', { value: 667 });

    render(<HomePage />);

    const inputBox = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button');

    await user.type(inputBox, 'Mobile test: 100, 200');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('chart-renderer')).toBeInTheDocument();
    });

    // Both input and chart should be visible and accessible on mobile
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByTestId('chart-renderer')).toBeInTheDocument();

    // Simulate desktop viewport
    Object.defineProperty(window, 'innerWidth', { value: 1200 });
    Object.defineProperty(window, 'innerHeight', { value: 800 });

    // Trigger resize event
    fireEvent(window, new Event('resize'));

    // Layout should still work on desktop
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByTestId('chart-renderer')).toBeInTheDocument();
  });

  it('should clear chart when starting fresh conversation', async () => {
    const user = userEvent.setup();

    // Mock first chart
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        chartConfig: {
          title: { text: 'First Chart' },
          series: [{ name: 'Data', type: 'bar', data: [100, 200] }]
        },
        conversationId: 'test-id-1'
      })
    });

    render(<HomePage />);

    const inputBox = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button');

    // Generate first chart
    await user.type(inputBox, 'First: 100, 200');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('chart-renderer')).toBeInTheDocument();
    });

    // Mock new conversation (no conversationId context)
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        chartConfig: {
          title: { text: 'New Chart' },
          series: [{ name: 'Data', type: 'pie', data: [{ name: 'A', value: 50 }] }]
        },
        conversationId: 'test-id-2'
      })
    });

    // Start completely new conversation
    await user.clear(inputBox);
    await user.type(inputBox, 'Completely new data: A 50, B 30');
    await user.click(submitButton);

    await waitFor(() => {
      const chartData = screen.getByTestId('chart-data');
      expect(chartData).toHaveTextContent('New Chart');
    });

    // Should show the new chart, not the old one
    expect(screen.getByTestId('chart-data')).not.toHaveTextContent('First Chart');
  });
});