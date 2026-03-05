import api from './api';
import { jwtDecode } from "jwt-decode";

export const authService = {

    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false, error: error.response?.data?.message
                    || error.response?.data?.error || 'Login failed'
            };
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.error || 'Registration failed'
            };
        }
    },

    decodeToken: (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    },

    getToken: () => {
        return localStorage.getItem('authToken');
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('authToken');
        if (!token) return null;

        return authService.decodeToken(token);
    },

    isTokenExpired: (token) => {
        try {
            const decoded = jwtDecode(token);
            if (!decoded.exp) return false;

            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('authToken');
        if (!token) return false;

        return !authService.isTokenExpired(token);
    },

    logout: () => {
        localStorage.removeItem('authToken');
    }
};