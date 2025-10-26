import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '@/types';

// Base API URL - Update this to match your backend
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10);

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token (but not for public endpoints)
api.interceptors.request.use(
  (config: any) => {
    // Don't add auth header for public/properties endpoints
    const isPublicEndpoint = config.url?.includes('/properties/list/') || 
                             config.url?.includes('/properties/') && !config.url?.includes('/properties/add/');
    
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - token might be invalid/expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't handle 401 for AllowAny endpoints - they should work without auth
      const isPublicEndpoint = originalRequest.url?.includes('/properties/list/') || 
                               originalRequest.url?.includes('/properties/') && !originalRequest.url?.includes('/properties/add/');
      
      if (isPublicEndpoint) {
        // For public endpoints, just retry without the auth header
        originalRequest._retry = true;
        delete originalRequest.headers.Authorization;
        return api(originalRequest);
      }
      
      // For protected endpoints, check if token is invalid
      if (error.response?.data?.code === 'token_not_valid') {
        console.warn('401 Unauthorized - Token invalid');
        // Don't clear token for protected endpoints - let components handle redirect
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error Details:', {
        message: error.message,
        code: error.code,
        config: error.config,
        request: error.request,
      });
      return Promise.reject({
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection.',
          details: error.message,
        },
      });
    }
    
    return Promise.reject(error.response.data);
  }
);

// API helper functions
export const apiService = {
  // GET request
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get(url, config);
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post(url, data, config);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.put(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete(url, config);
    return response.data;
  },

  // PATCH request
  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.patch(url, data, config);
    return response.data;
  },

  // File upload
  uploadFile: async <T>(url: string, file: File, onUploadProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      },
    };

    const response = await api.post(url, formData, config);
    return response.data;
  },
};

export default api;