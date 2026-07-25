import axios from 'axios';
import { API_BASE_URL, DEFAULT_TIMEOUT } from '../constants';

// -------------------------------------------------------------------
// Shared Axios Instance
// Architecture.md section 21: A single Axios instance shared across
// the application for base URL, timeout, interceptors.
// -------------------------------------------------------------------
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// -------------------------------------------------------------------
// Request Interceptor
// Architecture.md section 21 — Request Interceptors
// -------------------------------------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    // Future: inject auth headers here (Version 2)
    return config;
  },
  (error) => Promise.reject(error),
);

// -------------------------------------------------------------------
// Response Interceptor
// Architecture.md section 21 — Response Interceptors
// Normalises backend error responses before they reach service layer.
// -------------------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalised = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred.',
      status: error.response?.status || 0,
      success: false,
    };
    return Promise.reject(normalised);
  },
);

export default axiosInstance;
