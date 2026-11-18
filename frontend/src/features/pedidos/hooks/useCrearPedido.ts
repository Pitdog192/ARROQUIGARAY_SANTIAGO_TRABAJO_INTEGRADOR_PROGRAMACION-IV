import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearPedido } from '../api/pedidos';
import type { PedidoCreate } from '../types';

export const useCrearPedido = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: PedidoCreate) => crearPedido(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pedidos'] });
            queryClient.invalidateQueries({ queryKey: ['productos'] });
            queryClient.invalidateQueries({ queryKey: ['resumen-pedidos'] });
        },
    });
};