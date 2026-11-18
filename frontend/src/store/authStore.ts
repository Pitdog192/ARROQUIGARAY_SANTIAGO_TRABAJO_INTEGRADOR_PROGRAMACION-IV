import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from '../shared/api/axiosInstance';

export type Role = 'admin' | 'user';

export interface Usuario {
    id: number;
    username: string;
    full_name: string;
    email: string;
    role: Role;
    disabled: boolean;
}

interface AuthState {
    usuario: Usuario | null;
    cargando: boolean;
    login: (username: string, password: string) => Promise<Usuario>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            usuario: null,
            cargando: true,

            checkSession: async () => {
                try {
                    set({ cargando: true });
                    const { data } = await axiosInstance.get<Usuario>('/auth/me');
                    set({ usuario: data, cargando: false });
                } catch {
                    set({ usuario: null, cargando: false });
                }
            },

            login: async (username, password) => {
                const formData = new URLSearchParams();
                formData.append('username', username);
                formData.append('password', password);

                await axiosInstance.post('/auth/token', formData, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                });

                const { data } = await axiosInstance.get<Usuario>('/auth/me');
                set({ usuario: data, cargando: false });
                return data;
            },

            logout: async () => {
                try {
                    await axiosInstance.post('/auth/logout');
                } finally {
                    set({ usuario: null, cargando: false });
                }
            },
        }),
        {
            name: 'foodstore-auth',
            partialize: (state) => ({ usuario: state.usuario }),
        }
    )
);