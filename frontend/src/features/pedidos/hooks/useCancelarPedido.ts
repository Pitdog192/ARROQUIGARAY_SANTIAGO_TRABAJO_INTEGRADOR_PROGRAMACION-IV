import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelarPedido } from '../api/pedidos';

export const useCancelarPedido = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => cancelarPedido(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pedidos'] });
            queryClient.invalidateQueries({ queryKey: ['productos'] });
            queryClient.invalidateQueries({ queryKey: ['resumen-pedidos'] });
        },
    });
};