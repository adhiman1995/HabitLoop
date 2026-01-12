import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const activityAPI = {
    // Get all activities with optional filters
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.day_of_week) params.append('day_of_week', filters.day_of_week);
        if (filters.completed !== undefined) params.append('completed', filters.completed);

        return api.get(`/activities?${params.toString()}`);
    },

    // Get single activity
    getById: (id) => api.get(`/activities/${id}`),

    // Create new activity
    create: (activityData) => api.post('/activities', activityData),

    // Update activity
    update: (id, activityData) => api.put(`/activities/${id}`, activityData),

    // Toggle completion status
    toggleComplete: (id) => api.patch(`/activities/${id}/toggle`),
    getHeatmap: () => api.get('/activities/stats/heatmap'),

    // Delete activity
    delete: (id) => api.delete(`/activities/${id}`),
};

export default api;
