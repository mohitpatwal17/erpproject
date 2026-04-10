import axios from 'axios';
import { getToken, logout } from './auth';

// Create Axios instance
const api = axios.create({
    baseURL: 'https://api.education-erp.com/v1', // Mock URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            logout();
        }
        return Promise.reject(error);
    }
);

export default api;
