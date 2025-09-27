import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import will fail until component is implemented - this is expected for TDD
import { ChartRenderer } from '@/app/components/charts/chart-renderer';

// Mock ECharts
jest.mock('echarts-for-react', () => {
  return {
    __esModule: true,
    default: ({ option, style }: { option: Record<string, unknown>; style: Record<string, unknown> }) => (
      <div data-testid="mocked-chart" style={style}>
        <pre>{JSON.stringify(option, null, 2)}</pre>
      </div>
    ),
  };
});

describe('ChartRenderer', () => {
  const mockChartConfig = {
    title: {
      text: 'Test Chart'
    },
    xAxis: {
      data: ['Jan', 'Feb', 'Mar']
    },
    yAxis: {},
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [100, 150, 200]
      }
    ]
  };

  it('should render chart with provided configuration', async () => {
    render(
      <ChartRenderer
        chartConfig={mockChartConfig}
        isLoading={false}
      />
    );

    const chart = screen.getByTestId('mocked-chart');
    expect(chart).toBeInTheDocument();

    // Verify chart configuration is passed correctly
    expect(chart).toHaveTextContent('Test Chart');
    expect(chart).toHaveTextContent('Jan');
    expect(chart).toHaveTextContent('Feb');
    expect(chart).toHaveTextContent('Mar');
    expect(chart).toHaveTextContent('100');
    expect(chart).toHaveTextContent('150');
    expect(chart).toHaveTextContent('200');
  });

  it('should show loading state when isLoading is true', () => {
    render(
      <ChartRenderer
        chartConfig={mockChartConfig}
        isLoading={true}
      />
    );

    const loadingElement = screen.getByText(/loading|generating/i);
    expect(loadingElement).toBeInTheDocument();

    // Chart should not be visible during loading
    const chart = screen.queryByTestId('mocked-chart');
    expect(chart).not.toBeInTheDocument();
  });

  it('should handle empty chart configuration', () => {
    render(
      <ChartRenderer
        chartConfig={null}
        isLoading={false}
      />
    );

    // Should show empty state or placeholder
    const emptyState = screen.getByText(/no chart|empty|no data/i);
    expect(emptyState).toBeInTheDocument();
  });

  it('should be responsive and have proper dimensions', () => {
    render(
      <ChartRenderer
        chartConfig={mockChartConfig}
        isLoading={false}
      />
    );

    const chart = screen.getByTestId('mocked-chart');

    // Should have responsive styles
    expect(chart).toHaveStyle({
      width: '100%',
      height: expect.stringMatching(/\d+px|100%/)
    });
  });

  it('should handle different chart types', () => {
    const lineChartConfig = {
      ...mockChartConfig,
      series: [
        {
          name: 'Trend',
          type: 'line',
          data: [10, 20, 30]
        }
      ]
    };

    render(
      <ChartRenderer
        chartConfig={lineChartConfig}
        isLoading={false}
      />
    );

    const chart = screen.getByTestId('mocked-chart');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveTextContent('line');
  });

  it('should handle pie chart configuration', () => {
    const pieChartConfig = {
      title: {
        text: 'Market Share'
      },
      series: [
        {
          name: 'Share',
          type: 'pie',
          data: [
            { name: 'Apple', value: 30 },
            { name: 'Samsung', value: 25 },
            { name: 'Others', value: 45 }
          ]
        }
      ]
    };

    render(
      <ChartRenderer
        chartConfig={pieChartConfig}
        isLoading={false}
      />
    );

    const chart = screen.getByTestId('mocked-chart');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveTextContent('pie');
    expect(chart).toHaveTextContent('Apple');
    expect(chart).toHaveTextContent('Samsung');
  });

  it('should handle chart updates properly', async () => {
    const { rerender } = render(
      <ChartRenderer
        chartConfig={mockChartConfig}
        isLoading={false}
      />
    );

    // Initial chart
    expect(screen.getByTestId('mocked-chart')).toHaveTextContent('Test Chart');

    // Update chart configuration
    const updatedConfig = {
      ...mockChartConfig,
      title: {
        text: 'Updated Chart'
      }
    };

    rerender(
      <ChartRenderer
        chartConfig={updatedConfig}
        isLoading={false}
      />
    );

    // Should show updated content
    await waitFor(() => {
      expect(screen.getByTestId('mocked-chart')).toHaveTextContent('Updated Chart');
    });
  });

  it('should handle error states gracefully', () => {
    const invalidConfig = {
      // Invalid configuration that might cause errors
      series: 'invalid'
    };

    render(
      <ChartRenderer
        chartConfig={invalidConfig as unknown as ChartConfiguration}
        isLoading={false}
      />
    );

    // Should not crash and show some fallback
    const errorElement = screen.getByText(/error|invalid|failed/i);
    expect(errorElement).toBeInTheDocument();
  });

  it('should have accessibility attributes', () => {
    render(
      <ChartRenderer
        chartConfig={mockChartConfig}
        isLoading={false}
      />
    );

    const chartContainer = screen.getByRole('img', { name: /chart|graph|visualization/i });
    expect(chartContainer).toBeInTheDocument();

    // Should have proper ARIA labels
    expect(chartContainer).toHaveAttribute('aria-label');
  });

  it('should support theme customization', () => {
    render(
      <ChartRenderer
        chartConfig={mockChartConfig}
        isLoading={false}
        theme="dark"
      />
    );

    const chart = screen.getByTestId('mocked-chart');
    expect(chart).toBeInTheDocument();

    // Component should handle theme prop (implementation-specific)
  });
});