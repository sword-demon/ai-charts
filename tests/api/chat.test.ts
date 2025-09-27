import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('/api/chat', () => {
  const baseUrl = 'http://localhost:3000';

  beforeAll(async () => {
    // Setup test environment
  });

  afterAll(async () => {
    // Cleanup test environment
  });

  describe('POST /api/chat', () => {
    it('should generate chart from simple data prompt', async () => {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Compare Beijing sales 120,130,150 vs Shanghai sales 100,140,160',
          conversationId: null,
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('chartConfig');
      expect(data).toHaveProperty('conversationId');
      expect(data).toHaveProperty('message');

      // Validate chart configuration structure
      expect(data.chartConfig).toHaveProperty('title');
      expect(data.chartConfig).toHaveProperty('series');
      expect(data.chartConfig.series).toBeInstanceOf(Array);
      expect(data.chartConfig.series.length).toBeGreaterThan(0);
    });

    it('should handle specified chart type', async () => {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Show bar chart for Q1 sales: Jan 100, Feb 150, Mar 200',
          conversationId: null,
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.chartConfig.series[0].type).toBe('bar');
    });

    it('should maintain conversation context', async () => {
      // First request
      const firstResponse = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Monthly sales: Jan 100, Feb 150, Mar 200',
          conversationId: null,
        }),
      });

      const firstData = await firstResponse.json();
      const conversationId = firstData.conversationId;

      // Follow-up request
      const secondResponse = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Change to line chart',
          conversationId: conversationId,
        }),
      });

      expect(secondResponse.status).toBe(200);

      const secondData = await secondResponse.json();
      expect(secondData.success).toBe(true);
      expect(secondData.chartConfig.series[0].type).toBe('line');
      expect(secondData.conversationId).toBe(conversationId);
    });

    it('should return error for invalid input', async () => {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: '',
          conversationId: null,
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('message');
    });

    it('should return error for no data found', async () => {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Hello world, how are you?',
          conversationId: null,
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('NO_DATA_FOUND');
    });

    it('should handle multiple languages', async () => {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: '显示北京和上海的销售对比：北京 120，上海 100',
          conversationId: null,
          language: 'zh',
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.chartConfig).toHaveProperty('series');
    });
  });
});