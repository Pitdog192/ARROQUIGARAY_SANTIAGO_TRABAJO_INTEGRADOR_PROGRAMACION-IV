import type { EstadoPedido } from '../../features/pedidos/types';

export const BadgeEstado = ({ estado }: { estado: EstadoPedido }) => {
    const map: Record<EstadoPedido, string> = {
        PENDIENTE: 'bg-amber-100 text-amber-800',
        EN_PREPARACION: 'bg-blue-100 text-blue-800',
        ENTREGADO: 'bg-emerald-100 text-emerald-800',
        CANCELADO: 'bg-red-100 text-red-800',
    };

    return (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${map[estado]}`}>
            {estado.replace('_', ' ')}
        </span>
    );
};