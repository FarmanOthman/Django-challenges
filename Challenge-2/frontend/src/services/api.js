import axios from 'axios';

let authContext = null;

export const setAuthContext = (context) => {
    authContext = context;
};

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    
    try {
        const response = await axios.post('http://localhost:8000/api/auth/refresh/', {
            refresh,
        });
        
        localStorage.setItem('access_token', response.data.access);
        return response.data.access;
    } catch (error) {
        // Clear tokens and trigger logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (authContext?.logout) {
            authContext.logout();
        }
        return null;
    }
};

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh on 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newToken = await refreshToken();
            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default api; 