import { describe, it, expect } from '@jest/globals';

describe('/api/health', () => {
  const baseUrl = 'http://localhost:3000';

  describe('GET /api/health', () => {
    it('should return healthy status', async () => {
      const response = await fetch(`${baseUrl}/api/health`);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('status', 'healthy');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('version');

      // Validate timestamp format
      const timestamp = new Date(data.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();

      // Validate version format
      expect(typeof data.version).toBe('string');
      expect(data.version.length).toBeGreaterThan(0);
    });

    it('should respond quickly', async () => {
      const startTime = Date.now();
      const response = await fetch(`${baseUrl}/api/health`);
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(500); // Should respond within 500ms
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 10 }, () =>
        fetch(`${baseUrl}/api/health`)
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      const dataPromises = responses.map(response => response.json());
      const data = await Promise.all(dataPromises);

      data.forEach(item => {
        expect(item.status).toBe('healthy');
      });
    });

    it('should not accept POST method', async () => {
      const response = await fetch(`${baseUrl}/api/health`, {
        method: 'POST',
      });

      expect(response.status).toBe(405); // Method Not Allowed
    });

    it('should not accept PUT method', async () => {
      const response = await fetch(`${baseUrl}/api/health`, {
        method: 'PUT',
      });

      expect(response.status).toBe(405); // Method Not Allowed
    });

    it('should not accept DELETE method', async () => {
      const response = await fetch(`${baseUrl}/api/health`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(405); // Method Not Allowed
    });
  });
});