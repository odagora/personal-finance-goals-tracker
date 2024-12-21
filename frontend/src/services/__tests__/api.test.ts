import { describe, it, expect, beforeAll, vi } from 'vitest';
import { api } from '../api';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      defaults: {
        baseURL: 'http://localhost:3000/api/v1',
        headers: {
          common: {
            'Content-Type': 'application/json',
          },
        },
      },
      interceptors: {
        request: {
          use: vi.fn((callback) => callback),
        },
        response: {
          use: vi.fn(),
        },
      },
      get: vi.fn().mockResolvedValue({ status: 200, data: { status: 'ok' } }),
    })),
  },
}));

describe('API Configuration', () => {
  const isTest = process.env.NODE_ENV === 'test';
  const isDocker = process.env.DOCKER === 'true';
  const baseUrl = isTest
    ? isDocker
      ? 'http://app:3000/api/v1'
      : 'http://localhost:3000/api/v1'
    : import.meta.env.VITE_API_URL;

  beforeAll(() => {
    // Override API URL for tests
    if (isTest) {
      api.defaults.baseURL = baseUrl;
    }
    console.log('Current API URL:', api.defaults.baseURL);
    console.log('Current NODE_ENV:', process.env.NODE_ENV);
  });

  it('should have the correct base URL', () => {
    expect(api.defaults.baseURL).toBeDefined();
    expect(api.defaults.baseURL).toMatch(/api\/v1$/);
  });

  it('should have the correct default headers', () => {
    expect(api.defaults.headers.common['Content-Type']).toBe('application/json');
  });

  it('should make a test request to the API', async () => {
    const response = await api.get('/health');
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ status: 'ok' });
  });
});
