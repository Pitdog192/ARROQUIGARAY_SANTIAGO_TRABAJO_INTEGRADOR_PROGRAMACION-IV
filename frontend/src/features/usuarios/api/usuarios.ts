import { axiosInstance } from '../../../shared/api/axiosInstance';
import type { UsuarioAdmin } from '../types';

export const getUsuarios = async (): Promise<UsuarioAdmin[]> => {
    const { data } = await axiosInstance.get<UsuarioAdmin[]>('/admin/usuarios');
    return Array.isArray(data) ? data : [];
};

export const activarUsuario = async (id: number): Promise<UsuarioAdmin> => {
    const { data } = await axiosInstance.post<UsuarioAdmin>(`/admin/usuarios/${id}/activar`);
    return data;
};

export const desactivarUsuario = async (id: number): Promise<UsuarioAdmin> => {
    const { data } = await axiosInstance.post<UsuarioAdmin>(
        `/admin/usuarios/${id}/desactivar`
    );
    return data;
};