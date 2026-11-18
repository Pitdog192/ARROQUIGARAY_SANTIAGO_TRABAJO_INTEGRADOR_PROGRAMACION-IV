import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
} from '../api/categorias';
import type { CategoriaCreate, CategoriaUpdate } from '../types';

export const useCategorias = () => {
    return useQuery({
        queryKey: ['categorias'],
        queryFn: getCategorias,
    });
};

export const useCrearCategoria = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CategoriaCreate) => createCategoria(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        },
    });
};

export const useActualizarCategoria = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: CategoriaUpdate }) =>
            updateCategoria(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
            queryClient.invalidateQueries({ queryKey: ['productos'] });
        },
    });
};

export const useEliminarCategoria = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteCategoria(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        },
    });
};