import { axiosInstance } from '../../../shared/api/axiosInstance';
import type { Producto, ProductosPaginados, ProductoCreate, ProductoUpdate, ProductoStockUpdate, ProductosFiltros } from '../types';

export const getProductos = async (
    filtros: ProductosFiltros
): Promise<ProductosPaginados> => {
    const params: Record<string, string | number | boolean> = {
        skip: filtros.skip ?? 0,
        limit: filtros.limit ?? 20,
    };
    if (filtros.search?.trim()) params.search = filtros.search.trim();
    if (filtros.categoria_id) params.categoria_id = filtros.categoria_id;
    if (filtros.disponible !== undefined) params.disponible = filtros.disponible;

    const { data } = await axiosInstance.get<ProductosPaginados>('/productos', { params });
    if (Array.isArray(data)) {
        return { total: data.length, items: data };
    }
    return data;
};

export const createProducto = async (payload: ProductoCreate): Promise<Producto> => {
    const { data } = await axiosInstance.post<Producto>('/productos', payload);
    return data;
};

export const updateProducto = async (
    id: number,
    payload: ProductoUpdate
): Promise<Producto> => {
    const { data } = await axiosInstance.put<Producto>(`/productos/${id}`, payload);
    return data;
};

export const updateProductoStock = async (
    id: number,
    payload: ProductoStockUpdate
): Promise<Producto> => {
    const { data } = await axiosInstance.patch<Producto>(`/productos/${id}/stock`, payload);
    return data;
};

export const deleteProducto = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/productos/${id}`);
};