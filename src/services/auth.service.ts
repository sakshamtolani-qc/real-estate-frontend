import { apiService } from './api';
import { ApiResponse, User, LoginForm, RegisterForm } from '@/types';

export const authService = {
  // Login user (email/password)
  login: async (credentials: LoginForm): Promise<{ access: string; refresh: string; user: User }> => {
    // credentials: { email, password }
    const response = await apiService.post<any>('http://localhost:8000/api/email-login/', credentials);
    return response;
  },

  // Register new user (customer)
  register: async (userData: RegisterForm): Promise<ApiResponse<{ message: string; user: User }>> => {
    return apiService.post('http://localhost:8000/api/accounts/register/', userData);
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiService.get('/auth/auth/me/');
  },

  // Update current user profile
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiService.put('/auth/auth/me/', userData);
  },

  // Refresh JWT token
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ token: string }>> => {
    return apiService.post('/auth/auth/refresh/', { refresh_token: refreshToken });
  },

  // Logout user
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    return apiService.post('/auth/auth/logout/');
  },

  // Request password reset
  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return apiService.post('/auth/forgot-password', { email });
  },

  // Reset password with token
  resetPassword: async (token: string, password: string): Promise<ApiResponse<{ message: string }>> => {
    return apiService.post('/auth/reset-password', { token, password });
  },
};