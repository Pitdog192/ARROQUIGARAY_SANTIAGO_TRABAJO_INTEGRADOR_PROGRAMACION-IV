import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cambiarEstadoPedido } from '../api/pedidos';
import type { EstadoPedido } from '../types';

export const useCambiarEstadoPedido = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) =>
            cambiarEstadoPedido(id, estado),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pedidos'] });
            queryClient.invalidateQueries({ queryKey: ['productos'] });
            queryClient.invalidateQueries({ queryKey: ['resumen-pedidos'] });
        },
    });
};