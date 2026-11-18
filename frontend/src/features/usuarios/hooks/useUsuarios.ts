import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsuarios, activarUsuario, desactivarUsuario } from '../api/usuarios';

export const useUsuarios = () => {
    return useQuery({
        queryKey: ['usuarios'],
        queryFn: getUsuarios,
    });
};

export const useActivarUsuario = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => activarUsuario(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        },
    });
};

export const useDesactivarUsuario = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => desactivarUsuario(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        },
    });
};