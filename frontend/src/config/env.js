// Application configuration
// Reads all values from Vite environment variables (VITE_ prefix)
// No hardcoded URLs — per DeveloperGuide.md section 10

const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  requestTimeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 30000,
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
};

export default config;
