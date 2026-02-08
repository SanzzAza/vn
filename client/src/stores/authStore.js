import { create } from 'zustand';
import api from '../utils/api';
import Cookies from 'js-cookie';

export const useAuthStore = create((set) => ({
  user: null,
  token: Cookies.get('token') || null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      Cookies.set('token', token, { expires: 7 });
    } else {
      Cookies.remove('token');
    }
    set({ token });
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password
      });
      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false
      });
      Cookies.set('token', response.data.token, { expires: 7 });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false
      });
      Cookies.set('token', response.data.token, { expires: 7 });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    Cookies.remove('token');
    set({ user: null, token: null });
  },

  verifyToken: async () => {
    const token = Cookies.get('token');
    if (!token) return;

    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data.user });
    } catch (error) {
      Cookies.remove('token');
      set({ token: null, user: null });
    }
  },

  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/users/${userId}`, profileData);
      set({ user: response.data.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}));
