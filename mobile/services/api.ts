// ==========================================
// Axios API Client
// ==========================================
// This is our mobile app's "messenger" to the backend.
// Every API call goes through this file.
// It automatically attaches the login token to every request.

import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { Platform } from 'react-native';

// On Android emulator, localhost is 10.0.2.2
// On iOS simulator, localhost works directly
// On a real device, use your computer's local IP address
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5001/api';
    }
    return 'http://localhost:5001/api';
  }
  // In production, replace with your real server URL
  return 'https://your-production-api.com/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptor ──────────────────────────────
// This runs BEFORE every request.
// It grabs the token from our Auth Store and
// attaches it as a "Bearer" token in the header.
// The backend checks this token to know who you are.
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────
// This runs AFTER every response.
// If the token expired (401 error), we auto-logout.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
