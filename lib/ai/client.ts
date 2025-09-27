import OpenAI from 'openai';
import type {
  AIResponse,
  UserPrompt,
  ExtractedData,
  ChartConfiguration,
  ConversationMessage,
  ChartType
} from '@/lib/types';

interface BailianConfig {
  apiKey: string;
  baseURL: string;
  model: string;
}

const DEFAULT_CONFIG: BailianConfig = {
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  model: process.env.OPENAI_MODEL || 'qwen-plus'
};

class AIClient {
  private client: OpenAI;
  private config: BailianConfig;

  constructor(config?: Partial<BailianConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    if (!this.config.apiKey) {
      throw new Error('AI客户端初始化失败：缺少 API 密钥');
    }

    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseURL,
    });
  }

  async generateChart(
    prompt: UserPrompt,
    context?: ConversationMessage[]
  ): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userMessage = this.buildUserMessage(prompt, context);

      const completion = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('AI 响应为空');
      }

      return this.parseAIResponse(responseContent);
    } catch (error) {
      console.error('AI 图表生成失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  private buildSystemPrompt(): string {
    return `你是一个专业的数据可视化专家，负责将用户的自然语言描述转换为结构化的图表配置。

你的任务：
1. 理解用户描述的数据和可视化需求
2. 提取并结构化数据
3. 确定最适合的图表类型
4. 生成完整的 ECharts 配置

支持的图表类型：line（折线图）、bar（柱状图）、pie（饼图）、scatter（散点图）、area（面积图）、column（柱形图）、radar（雷达图）、funnel（漏斗图）、gauge（仪表盘）、heatmap（热力图）

响应格式（必须是有效的 JSON）：
{
  "success": true,
  "extractedData": {
    "data": [{"name": "项目A", "value": 100}, {"name": "项目B", "value": 200}],
    "headers": ["name", "value"],
    "dataTypes": {"name": "string", "value": "number"},
    "summary": {
      "rowCount": 2,
      "numericColumns": ["value"],
      "categoricalColumns": ["name"],
      "dateColumns": []
    }
  },
  "chartConfig": {
    "type": "bar",
    "title": "项目数据分析",
    "xAxis": {"name": "项目", "type": "category"},
    "yAxis": {"name": "数值", "type": "value"},
    "series": [{
      "name": "数据系列",
      "type": "bar",
      "data": [100, 200]
    }],
    "legend": {"show": true},
    "tooltip": {"trigger": "axis"}
  },
  "reasoning": "选择柱状图是因为...",
  "suggestions": ["可以尝试使用饼图显示占比", "添加趋势线分析"]
}

重要约束：
- 响应必须是有效的 JSON 格式
- 数据必须是结构化和可解析的
- 图表配置必须符合 ECharts 规范
- 如果无法解析数据，返回 success: false 和错误信息`;
  }

  private buildUserMessage(prompt: UserPrompt, context?: ConversationMessage[]): string {
    let message = `用户请求：${prompt.text}`;

    if (context && context.length > 0) {
      const contextSummary = context
        .slice(-3)
        .map(msg => `${msg.type}: ${msg.content}`)
        .join('\n');
      message += `\n\n对话上下文：\n${contextSummary}`;
    }

    return message;
  }

  private parseAIResponse(content: string): AIResponse {
    try {
      const parsed = JSON.parse(content);

      if (!parsed.success) {
        return {
          success: false,
          error: parsed.error || '解析失败'
        };
      }

      const response: AIResponse = {
        success: true,
        extractedData: this.validateExtractedData(parsed.extractedData),
        chartConfig: this.validateChartConfig(parsed.chartConfig),
        reasoning: parsed.reasoning,
        suggestions: parsed.suggestions || []
      };

      return response;
    } catch (error) {
      console.error('解析 AI 响应失败:', error);
      return {
        success: false,
        error: `响应解析失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  private validateExtractedData(data: unknown): ExtractedData {
    if (!data || typeof data !== 'object') {
      throw new Error('无效的数据格式');
    }

    const dataObj = data as Record<string, unknown>;
    if (!Array.isArray(dataObj.data)) {
      throw new Error('无效的数据格式');
    }

    return {
      data: dataObj.data,
      headers: (dataObj.headers as string[]) || [],
      dataTypes: (dataObj.dataTypes as Record<string, 'number' | 'string' | 'date'>) || {},
      summary: {
        rowCount: (dataObj.summary as any)?.rowCount || dataObj.data.length,
        numericColumns: (dataObj.summary as any)?.numericColumns || [],
        categoricalColumns: (dataObj.summary as any)?.categoricalColumns || [],
        dateColumns: (dataObj.summary as any)?.dateColumns || []
      }
    };
  }

  private validateChartConfig(config: unknown): ChartConfiguration {
    if (!config || typeof config !== 'object') {
      throw new Error('无效的图表配置');
    }

    const configObj = config as Record<string, unknown>;
    if (!configObj.type) {
      throw new Error('无效的图表配置');
    }

    const validTypes: ChartType[] = [
      'line', 'bar', 'pie', 'scatter', 'area',
      'column', 'radar', 'funnel', 'gauge', 'heatmap'
    ];

    if (!validTypes.includes(configObj.type as ChartType)) {
      throw new Error(`不支持的图表类型: ${configObj.type}`);
    }

    return {
      type: configObj.type as ChartType,
      title: (configObj.title as string) || '图表',
      xAxis: configObj.xAxis as ChartConfiguration['xAxis'],
      yAxis: configObj.yAxis as ChartConfiguration['yAxis'],
      series: (configObj.series as ChartConfiguration['series']) || [],
      legend: configObj.legend as ChartConfiguration['legend'],
      tooltip: configObj.tooltip as ChartConfiguration['tooltip'],
      grid: configObj.grid as ChartConfiguration['grid'],
      color: configObj.color as string[],
      animation: configObj.animation !== false,
      animationDuration: (configObj.animationDuration as number) || 1000
    };
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'user', content: '测试连接' }
        ],
        max_tokens: 10
      });

      if (response.choices[0]?.message?.content) {
        return { success: true };
      } else {
        return { success: false, error: 'AI 服务响应异常' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '连接测试失败'
      };
    }
  }

  getConfig(): BailianConfig {
    return { ...this.config };
  }
}

export const aiClient = new AIClient();
export default AIClient;