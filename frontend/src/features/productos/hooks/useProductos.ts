import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductos, createProducto, updateProducto, updateProductoStock, deleteProducto } from '../api/productos';
import type { ProductosFiltros, ProductoCreate, ProductoUpdate, ProductoStockUpdate } from '../types';

export const useProductos = (filtros: ProductosFiltros) => {
    return useQuery({
        queryKey: ['productos', filtros],
        queryFn: () => getProductos(filtros),
    });
};

export const useCrearProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ProductoCreate) => createProducto(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos'] });
        },
    });
};

export const useActualizarProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: ProductoUpdate }) =>
            updateProducto(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos'] });
        },
    });
};

export const useCambiarStockProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: ProductoStockUpdate }) =>
            updateProductoStock(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos'] });
        },
    });
};

export const useEliminarProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteProducto(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos'] });
        },
    });
};