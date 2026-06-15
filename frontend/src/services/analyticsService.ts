import { apiClient } from './apiClient';

export const analyticsService = {
  getOverview: async () => {
    const response = await apiClient.get('/analytics/overview');
    return response.data.data;
  },

  getQueryTrends: async () => {
    const response = await apiClient.get('/analytics/charts/trends');
    return response.data.data;
  },

  getServiceDistribution: async () => {
    const response = await apiClient.get('/analytics/charts/services');
    return response.data.data;
  },

  getIntentDistribution: async () => {
    const response = await apiClient.get('/analytics/charts/intents');
    return response.data.data;
  },

  getQueryExplorer: async (page = 1, limit = 10, search = '') => {
    const response = await apiClient.get(`/analytics/explorer?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },

  getServiceHealth: async (serviceName: string) => {
    try {
      const startTime = Date.now();
      const response = await apiClient.get(`/health/${serviceName}`);
      const latency = Date.now() - startTime;
      return { status: response.data.status, latency };
    } catch (_error) {
      return { status: 'unhealthy', latency: 0 };
    }
  }
};
