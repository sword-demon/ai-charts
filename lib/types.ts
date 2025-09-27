export interface UserPrompt {
  text: string;
  timestamp: number;
  sessionId?: string;
}

export interface ExtractedData {
  data: Array<Record<string, unknown>>;
  headers: string[];
  dataTypes: Record<string, 'number' | 'string' | 'date'>;
  summary: {
    rowCount: number;
    numericColumns: string[];
    categoricalColumns: string[];
    dateColumns: string[];
  };
}

export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'scatter'
  | 'area'
  | 'column'
  | 'radar'
  | 'funnel'
  | 'gauge'
  | 'heatmap';

export interface ChartConfiguration {
  type: ChartType;
  title: string;
  xAxis?: {
    name: string;
    type: 'category' | 'value' | 'time';
    data?: string[];
  };
  yAxis?: {
    name: string;
    type: 'category' | 'value' | 'time';
  };
  series: Array<{
    name: string;
    type: ChartType;
    data: Array<unknown>;
    itemStyle?: Record<string, unknown>;
    lineStyle?: Record<string, unknown>;
    areaStyle?: Record<string, unknown>;
  }>;
  legend?: {
    show: boolean;
    data?: string[];
  };
  tooltip?: {
    trigger: 'item' | 'axis' | 'none';
    formatter?: string;
  };
  grid?: {
    left: string | number;
    right: string | number;
    top: string | number;
    bottom: string | number;
  };
  color?: string[];
  animation?: boolean;
  animationDuration?: number;
}

export interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
  chartConfig?: ChartConfiguration;
  extractedData?: ExtractedData;
}

export interface ConversationContext {
  sessionId: string;
  messages: ConversationMessage[];
  currentData?: ExtractedData;
  currentChartConfig?: ChartConfiguration;
  metadata: {
    createdAt: number;
    updatedAt: number;
    messageCount: number;
  };
}

export interface AIResponse {
  success: boolean;
  extractedData?: ExtractedData;
  chartConfig?: ChartConfiguration;
  reasoning?: string;
  error?: string;
  suggestions?: string[];
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: number;
}

export interface ChatRequest {
  prompt: string;
  sessionId?: string;
  contextMessages?: ConversationMessage[];
}

export interface ChatResponse {
  success: boolean;
  message: ConversationMessage;
  chartConfig?: ChartConfiguration;
  extractedData?: ExtractedData;
  conversationContext: ConversationContext;
  error?: {
    code: string;
    message: string;
  };
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  services: {
    ai: 'up' | 'down' | 'unknown';
    database: 'up' | 'down' | 'unknown';
  };
  version: string;
  uptime: number;
}

export interface ChartTheme {
  name: string;
  colors: string[];
  backgroundColor: string;
  textStyle: {
    color: string;
    fontFamily: string;
    fontSize: number;
  };
  title: {
    textStyle: {
      color: string;
      fontSize: number;
      fontWeight: string;
    };
  };
  legend: {
    textStyle: {
      color: string;
    };
  };
  grid: {
    borderColor: string;
  };
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: string;
      };
    };
    splitLine: {
      lineStyle: {
        color: string;
      };
    };
  };
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: string;
      };
    };
    splitLine: {
      lineStyle: {
        color: string;
      };
    };
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ChartGenerationOptions {
  theme?: string;
  responsive?: boolean;
  animation?: boolean;
  locale?: 'zh-CN' | 'en-US';
}

export interface AppError {
  name: string;
  message: string;
  code: string;
  status: number;
  timestamp: number;
  context?: Record<string, unknown>;
}

export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}