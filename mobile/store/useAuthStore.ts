// ==========================================
// Authentication Store (Zustand)
// ==========================================
// This remembers WHO is logged in and their
// secure token (JWT). Uses expo-secure-store
// which works natively with Expo Go.

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  // Actions
  setCredentials: (user: User, token: string) => void;
  logout: () => void;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  // Called after a successful login/register
  setCredentials: async (user, token) => {
    try {
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('authUser', JSON.stringify(user));
    } catch (e) {
      console.log('SecureStore save error:', e);
    }
    set({ user, token, isLoading: false });
  },

  // Called when user taps "Logout"
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('authUser');
    } catch (e) {
      console.log('SecureStore delete error:', e);
    }
    set({ user: null, token: null, isLoading: false });
  },

  // Called when the app first opens to check if we were logged in before
  loadStoredAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const userStr = await SecureStore.getItemAsync('authUser');
      if (token && userStr) {
        set({ user: JSON.parse(userStr), token, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
