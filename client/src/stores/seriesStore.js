import { create } from 'zustand';
import api from '../utils/api';

export const useSeriesStore = create((set) => ({
  series: [],
  trending: [],
  bookmarks: [],
  history: [],
  continueWatching: [],
  isLoading: false,
  error: null,

  fetchSeries: async (page = 1, limit = 12) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/series?page=${page}&limit=${limit}`);
      set({
        series: response.data.data,
        isLoading: false
      });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchTrendingSeries: async () => {
    try {
      const response = await api.get('/series/trending/all');
      set({ trending: response.data.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchSeriesByGenre: async (genre, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/series/genre/${genre}?page=${page}&limit=12`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchSeriesDetail: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/series/${id}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchBookmarks: async (page = 1) => {
    try {
      const response = await api.get(`/bookmarks?page=${page}&limit=12`);
      set({ bookmarks: response.data.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addBookmark: async (seriesId) => {
    try {
      const response = await api.post('/bookmarks', { seriesId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  removeBookmark: async (seriesId) => {
    try {
      const response = await api.delete(`/bookmarks/${seriesId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  checkBookmark: async (seriesId) => {
    try {
      const response = await api.get(`/bookmarks/check/${seriesId}`);
      return response.data.isBookmarked;
    } catch (error) {
      return false;
    }
  },

  fetchHistory: async (page = 1) => {
    try {
      const response = await api.get(`/history?page=${page}&limit=12`);
      set({ history: response.data.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchContinueWatching: async () => {
    try {
      const response = await api.get('/history/continue/watching');
      set({ continueWatching: response.data.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addToHistory: async (seriesId, episodeId, currentTime, duration, completed) => {
    try {
      const response = await api.post('/history', {
        seriesId,
        episodeId,
        currentTime,
        duration,
        completed
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}));
