import { axiosInstance } from '../../../shared/api/axiosInstance';
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '../types';

export const getCategorias = async (): Promise<Categoria[]> => {
    const { data } = await axiosInstance.get<Categoria[]>('/categorias');
    return Array.isArray(data) ? data : [];
};

export const createCategoria = async (payload: CategoriaCreate): Promise<Categoria> => {
    const { data } = await axiosInstance.post<Categoria>('/categorias', payload);
    return data;
};

export const updateCategoria = async (
    id: number,
    payload: CategoriaUpdate
): Promise<Categoria> => {
    const { data } = await axiosInstance.put<Categoria>(`/categorias/${id}`, payload);
    return data;
};

export const deleteCategoria = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/categorias/${id}`);
};