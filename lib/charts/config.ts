import type {
  ChartConfiguration,
  ChartType,
  ExtractedData,
  ChartGenerationOptions
} from '@/lib/types';

export interface EChartsOption {
  title?: {
    text: string;
    left?: string;
    top?: string;
    textStyle?: {
      color?: string;
      fontSize?: number;
      fontWeight?: string;
    };
  };
  tooltip?: {
    trigger: 'item' | 'axis' | 'none';
    formatter?: string | ((params: unknown) => string);
    axisPointer?: {
      type: 'line' | 'shadow' | 'cross';
    };
  };
  legend?: {
    show: boolean;
    data?: string[];
    orient?: 'horizontal' | 'vertical';
    left?: string;
    top?: string;
  };
  xAxis?: {
    type: 'category' | 'value' | 'time' | 'log';
    name?: string;
    data?: (string | number)[];
    nameLocation?: 'start' | 'middle' | 'end';
    nameTextStyle?: {
      color?: string;
      fontSize?: number;
    };
    axisLabel?: {
      rotate?: number;
      interval?: number | 'auto';
    };
  };
  yAxis?: {
    type: 'category' | 'value' | 'time' | 'log';
    name?: string;
    nameLocation?: 'start' | 'middle' | 'end';
    nameTextStyle?: {
      color?: string;
      fontSize?: number;
    };
  };
  series: Array<{
    name: string;
    type: ChartType;
    data: unknown[];
    itemStyle?: Record<string, unknown>;
    lineStyle?: Record<string, unknown>;
    areaStyle?: Record<string, unknown>;
    label?: {
      show?: boolean;
      position?: string;
      formatter?: string;
    };
    emphasis?: Record<string, unknown>;
    radius?: string | string[];
    center?: string[];
    roseType?: boolean | 'radius' | 'area';
    symbolSize?: number | ((params: unknown) => number);
    smooth?: boolean;
  }>;
  grid?: {
    left: string | number;
    right: string | number;
    top: string | number;
    bottom: string | number;
    containLabel?: boolean;
  };
  color?: string[];
  backgroundColor?: string;
  animation?: boolean;
  animationDuration?: number;
  radar?: {
    indicator: Array<{
      name: string;
      max: number;
      min?: number;
    }>;
    shape?: 'polygon' | 'circle';
    radius?: string;
    center?: string[];
  };
  visualMap?: {
    min: number;
    max: number;
    calculable?: boolean;
    orient?: 'horizontal' | 'vertical';
    left?: string;
    bottom?: string;
    inRange?: {
      color?: string[];
    };
  };
}

class ChartConfigBuilder {
  private baseConfig: Partial<EChartsOption> = {
    animation: true,
    animationDuration: 1000,
    grid: {
      left: '10%',
      right: '10%',
      top: '15%',
      bottom: '15%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    }
  };

  buildChartConfig(
    chartConfig: ChartConfiguration,
    data: ExtractedData,
    _options?: ChartGenerationOptions
  ): EChartsOption {
    const config: EChartsOption = {
      ...this.baseConfig,
      series: []  // 确保 series 初始为空数组
    };

    config.title = this.buildTitle(chartConfig.title);
    config.color = this.getThemeColors(_options?.theme);

    switch (chartConfig.type) {
      case 'line':
        return this.buildLineChart(config, chartConfig, data, _options);
      case 'bar':
      case 'column':
        return this.buildBarChart(config, chartConfig, data, _options);
      case 'pie':
        return this.buildPieChart(config, chartConfig, data, _options);
      case 'scatter':
        return this.buildScatterChart(config, chartConfig, data, _options);
      case 'area':
        return this.buildAreaChart(config, chartConfig, data, _options);
      case 'radar':
        return this.buildRadarChart(config, chartConfig, data, _options);
      case 'funnel':
        return this.buildFunnelChart(config, chartConfig, data, _options);
      case 'gauge':
        return this.buildGaugeChart(config, chartConfig, data, _options);
      case 'heatmap':
        return this.buildHeatmapChart(config, chartConfig, data, _options);
      default:
        throw new Error(`不支持的图表类型: ${chartConfig.type}`);
    }
  }

  private buildTitle(title: string): EChartsOption['title'] {
    return {
      text: title,
      left: 'center',
      top: '20px',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    };
  }

  private getThemeColors(theme?: string): string[] {
    const themes: Record<string, string[]> = {
      default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
      business: ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#65a30d'],
      minimal: ['#374151', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6'],
      colorful: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899']
    };

    return themes[theme || 'default'] || themes.default;
  }

  private buildLineChart(
    config: EChartsOption,
    chartConfig: ChartConfiguration,
    data: ExtractedData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options?: ChartGenerationOptions
  ): EChartsOption {
    config.xAxis = {
      type: chartConfig.xAxis?.type || 'category',
      name: chartConfig.xAxis?.name,
      data: chartConfig.xAxis?.data || this.extractCategories(data)
    };

    config.yAxis = {
      type: chartConfig.yAxis?.type || 'value',
      name: chartConfig.yAxis?.name
    };

    config.series = chartConfig.series.map(series => ({
      ...series,
      smooth: true,
      symbolSize: 6,
      lineStyle: {
        width: 2
      }
    }));

    config.tooltip = {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    };

    return config;
  }

  private buildBarChart(
    config: EChartsOption,
    chartConfig: ChartConfiguration,
    data: ExtractedData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options?: ChartGenerationOptions
  ): EChartsOption {
    config.xAxis = {
      type: chartConfig.xAxis?.type || 'category',
      name: chartConfig.xAxis?.name,
      data: chartConfig.xAxis?.data || this.extractCategories(data),
      axisLabel: {
        rotate: this.shouldRotateLabels(data) ? 45 : 0
      }
    };

    config.yAxis = {
      type: chartConfig.yAxis?.type || 'value',
      name: chartConfig.yAxis?.name
    };

    config.series = chartConfig.series.map(series => ({
      ...series,
      barWidth: '60%',
      itemStyle: {
        borderRadius: [2, 2, 0, 0]
      },
      label: {
        show: data.summary.rowCount <= 10,
        position: 'top'
      }
    }));

    return config;
  }

  private buildPieChart(
    config: EChartsOption,
    chartConfig: ChartConfiguration,
    data: ExtractedData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options?: ChartGenerationOptions
  ): EChartsOption {
    delete config.xAxis;
    delete config.yAxis;
    delete config.grid;

    config.tooltip = {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    };

    config.legend = {
      show: true,
      orient: 'vertical',
      left: 'left',
      data: this.extractCategories(data)
    };

    config.series = chartConfig.series.map(series => ({
      ...series,
      radius: data.summary.rowCount > 8 ? ['40%', '70%'] : '60%',
      center: ['60%', '50%'],
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: data.summary.rowCount <= 6,
        formatter: '{b}: {d}%'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }));

    return config;
  }

  private buildScatterChart(
    config: EChartsOption,
    chartConfig: ChartConfiguration,
    data: ExtractedData,
    _options?: ChartGenerationOptions
  ): EChartsOption {
    config.xAxis = {
      type: 'value',
      name: chartConfig.xAxis?.name,
      nameLocation: 'middle',
      nameTextStyle: {
        fontSize: 12
      }
    };

    config.yAxis = {
      type: 'value',
      name: chartConfig.yAxis?.name,
      nameLocation: 'middle'
    };

    config.series = chartConfig.series.map(series => ({
      ...series,
      symbolSize: 8,
      itemStyle: {
        opacity: 0.8
      }
    }));

    config.tooltip = {
      trigger: 'item',
      formatter: ((params: unknown) => {
        const p = params as { seriesName: string; data: [number, number] };
        return `${p.seriesName}<br/>${p.data[0]}, ${p.data[1]}`;
      }) as string | ((params: unknown) => string)
    };

    return config;
  }

  private buildAreaChart(
    config: EChartsOption,
    chartConfig: ChartConfiguration,
    data: ExtractedData,
    _options?: ChartGenerationOptions
  ): EChartsOption {
    config.xAxis = {
      type: chartConfig.xAxis?.type || 'category',
      name: chartConfig.xAxis?.name,
      data: chartConfig.xAxis?.data || this.extractCategories(data)
    };

    config.yAxis = {
      type: chartConfig.yAxis?.type || 'value',
      name: chartConfig.yAxis?.name
    };

    config.series = chartConfig.series.map(series => ({
      ...series,
      areaStyle: {
        opacity: 0.6
      },
      smooth: true,
      symbolSize: 4
    }));

    config.tooltip = {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    };

    return config;
  }

  private buildRadarChart(
    config: EChartsOption,
    chartConfig: ChartConfiguration,
    data: ExtractedData,
    _options?: ChartGenerationOptions
  ): EChartsOption {
    delete config.xAxis;
    delete config.yAxis;
    delete config.grid;

    const indicators = this.extractRadarIndicators(data);
    config.radar = {
      indicator: indicators,
      shape: 'polygon',
      radius: '70%',
      center: ['50%', '55%']
    };

    config.series = chartConfig.series.map(series => ({
      ...series,
      itemStyle: {
        opacity: 0.8
      },
      areaStyle: {
        opacity: 0.3
      }
    }));

    config.tooltip = {
      trigger: 'item'
    };

    return config;
  }

  private buildFunnelChart(
    config: EChartsOption,
    chartConfig: ChartConfiguration,
    data: ExtractedData,
    _options?: ChartGenerationOptions
  ): EChartsOption {
    delete config.xAxis;
    delete config.yAxis;
    delete config.grid;

    config.tooltip = {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    };

    config.series = chartConfig.series.map(series => ({
      ...series,
      left: '10%',
      top: 60,
      width: '80%',
      height: '80%',
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      },
      label: {
        show: true,
        position: 'inside'
      },
      emphasis: {
        label: {
          fontSize: 20
        }
      }
    }));

    return config;
  }

  private buildGaugeChart(
    config: EChartsOption,
    chartConfig: ChartConfiguration,
    data: ExtractedData,
    _options?: ChartGenerationOptions
  ): EChartsOption {
    delete config.xAxis;
    delete config.yAxis;
    delete config.grid;

    config.series = chartConfig.series.map(series => ({
      ...series,
      radius: '80%',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -40,
      min: 0,
      max: this.getMaxValue(data),
      splitNumber: 10,
      itemStyle: {
        color: '#58D9F9',
        shadowColor: 'rgba(0,138,255,0.45)',
        shadowBlur: 10,
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }));

    return config;
  }

  private buildHeatmapChart(
    config: EChartsOption,
    chartConfig: ChartConfiguration,
    data: ExtractedData,
    _options?: ChartGenerationOptions
  ): EChartsOption {
    config.xAxis = {
      type: 'category',
      data: chartConfig.xAxis?.data || this.extractCategories(data),
      splitArea: {
        show: true
      }
    };

    config.yAxis = {
      type: 'category',
      data: chartConfig.yAxis?.data || this.extractYCategories(data),
      splitArea: {
        show: true
      }
    };

    const [minValue, maxValue] = this.getValueRange(data);
    config.visualMap = {
      min: minValue,
      max: maxValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    };

    config.series = chartConfig.series.map(series => ({
      ...series,
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }));

    return config;
  }

  private extractCategories(data: ExtractedData): string[] {
    if (data.summary.categoricalColumns.length > 0) {
      const categoryColumn = data.summary.categoricalColumns[0];
      return data.data.map(row => String(row[categoryColumn]));
    }
    return data.headers.filter(h => h !== 'value');
  }

  private extractYCategories(data: ExtractedData): string[] {
    if (data.summary.categoricalColumns.length > 1) {
      const categoryColumn = data.summary.categoricalColumns[1];
      return Array.from(new Set(data.data.map(row => String(row[categoryColumn]))));
    }
    return ['Category'];
  }

  private extractRadarIndicators(data: ExtractedData): Array<{ name: string; max: number }> {
    const numericColumns = data.summary.numericColumns;
    const maxValues = numericColumns.map(col => {
      const values = data.data.map(row => Number(row[col]) || 0);
      return Math.max(...values) * 1.2; // 增加20%的余量
    });

    return numericColumns.map((col, index) => ({
      name: col,
      max: maxValues[index]
    }));
  }

  private getMaxValue(data: ExtractedData): number {
    const numericColumns = data.summary.numericColumns;
    if (numericColumns.length === 0) return 100;

    const values = data.data.flatMap(row =>
      numericColumns.map(col => Number(row[col]) || 0)
    );

    return Math.max(...values) * 1.1; // 增加10%的余量
  }

  private getValueRange(data: ExtractedData): [number, number] {
    const numericColumns = data.summary.numericColumns;
    if (numericColumns.length === 0) return [0, 100];

    const values = data.data.flatMap(row =>
      numericColumns.map(col => Number(row[col]) || 0)
    );

    return [Math.min(...values), Math.max(...values)];
  }

  private shouldRotateLabels(data: ExtractedData): boolean {
    const categories = this.extractCategories(data);
    const avgLength = categories.reduce((sum, cat) => sum + cat.length, 0) / categories.length;
    return avgLength > 6 || categories.length > 8;
  }
}

export const chartConfigBuilder = new ChartConfigBuilder();

export const validateChartConfig = (config: EChartsOption): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.series || config.series.length === 0) {
    errors.push('图表配置缺少数据系列');
  }

  if (config.series?.some(series => !series.type)) {
    errors.push('数据系列缺少类型定义');
  }

  if (config.series?.some(series => !Array.isArray(series.data))) {
    errors.push('数据系列的data字段必须是数组');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getResponsiveConfig = (width: number): Partial<EChartsOption> => {
  if (width < 768) {
    return {
      grid: {
        left: '5%',
        right: '5%',
        top: '20%',
        bottom: '20%',
        containLabel: true
      },
      title: {
        text: '',
        textStyle: {
          fontSize: 14
        }
      },
      legend: {
        show: true,
        orient: 'horizontal',
        top: 'bottom'
      }
    };
  }

  return {};
};

export default chartConfigBuilder;