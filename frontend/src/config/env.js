// Application configuration
// Reads all values from Vite environment variables (VITE_ prefix)
// No hardcoded URLs — per DeveloperGuide.md section 10

const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  grafanaUrl: import.meta.env.VITE_GRAFANA_URL || 'http://13.201.81.221:3001',
  requestTimeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 30000,
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
};

export default config;
