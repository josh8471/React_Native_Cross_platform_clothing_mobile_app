// ==========================================
// Auth API Service
// ==========================================
// Functions to call the backend auth endpoints.
// Used by the Login and Register screens.

import api from './api';
import { User } from '../types';

interface AuthResponse {
  user: User;
  token: string;
}

// Register a new user
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', {
    name,
    email,
    password,
  });
  return data;
};

// Login an existing user
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return data;
};

// Get current user profile
export const getProfile = async (): Promise<User> => {
  const { data } = await api.get<User>('/auth/me');
  return data;
};
