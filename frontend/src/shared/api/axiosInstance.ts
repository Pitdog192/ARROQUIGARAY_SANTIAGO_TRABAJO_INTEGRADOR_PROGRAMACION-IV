import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const detail = error.response?.data?.detail;
        const requestUrl: string = error.config?.url || '';

        const isUnauthorized =
            status === 401 &&
            !requestUrl.includes('/auth/me') &&
            !requestUrl.includes('/auth/token');

        const isDeactivated =
            status === 400 &&
            typeof detail === 'string' &&
            detail.toLowerCase().includes('desactivada');

        if (isUnauthorized || isDeactivated) {
            useAuthStore.setState({ usuario: null, cargando: false });
            localStorage.removeItem('foodstore-auth');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);