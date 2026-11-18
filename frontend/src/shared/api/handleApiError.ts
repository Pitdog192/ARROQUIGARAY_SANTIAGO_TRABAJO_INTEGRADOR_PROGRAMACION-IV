import axios from 'axios';

export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        if (typeof detail === 'string') {
            return detail;
        }
        if (Array.isArray(detail) && detail.length > 0) {
            return detail.map((err) => err.msg || JSON.stringify(err)).join(', ');
        }
        return error.message || 'Error de comunicación con el servidor';
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'Ocurrió un error inesperado';
};