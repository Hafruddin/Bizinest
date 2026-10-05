import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let getAuthToken = null;

/**
 * Configure dynamic JWT injection from Clerk.
 * Called in the main Auth/Context initializer.
 */
export const setTokenResolver = (fn) => {
  getAuthToken = fn;
};

export const getActiveToken = async () => {
  if (getAuthToken) {
    return await getAuthToken();
  }
  return null;
};

// Request interceptor to automatically add the Clerk bearer token
api.interceptors.request.use(
  async (config) => {
    if (getAuthToken) {
      try {
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          config.headers.Authorization = `Bearer mock_clerk_user_123`;
        }
      } catch (err) {
        console.error('API Request Interceptor Auth Error:', err);
        config.headers.Authorization = `Bearer mock_clerk_user_123`;
      }
    } else {
      config.headers.Authorization = `Bearer mock_clerk_user_123`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch unauthorized errors or logs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request. Session may be expired.');
    }
    return Promise.reject(error);
  }
);

export default api;
