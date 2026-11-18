import { axiosInstance } from '../../../shared/api/axiosInstance';
import type { Pedido, PedidoCreate, PedidosPaginados, PedidosFiltros, EstadoPedido, ResumenPedidos } from '../types';

export const getPedidos = async (
    filtros: PedidosFiltros = {}
): Promise<PedidosPaginados> => {
    const params: Record<string, string | number> = {
        skip: filtros.skip ?? 0,
        limit: filtros.limit ?? 50,
    };
    if (filtros.estado) {
        params.estado = filtros.estado;
    }

    const { data } = await axiosInstance.get<PedidosPaginados>('/pedidos', { params });
    if (Array.isArray(data)) {
        return { total: data.length, items: data };
    }
    return data;
};

export const getPedidoById = async (id: number): Promise<Pedido> => {
    const { data } = await axiosInstance.get<Pedido>(`/pedidos/${id}`);
    return data;
};

export const getResumenPedidos = async (): Promise<ResumenPedidos> => {
    const { data } = await axiosInstance.get<ResumenPedidos>('/pedidos/resumen');
    return data;
};

export const crearPedido = async (payload: PedidoCreate): Promise<Pedido> => {
    const { data } = await axiosInstance.post<Pedido>('/pedidos', payload);
    return data;
};

export const cambiarEstadoPedido = async (
    id: number,
    estado: EstadoPedido
): Promise<Pedido> => {
    const { data } = await axiosInstance.patch<Pedido>(`/pedidos/${id}/estado`, {
        estado,
    });
    return data;
};

export const cancelarPedido = async (id: number): Promise<Pedido> => {
    const { data } = await axiosInstance.patch<Pedido>(`/pedidos/${id}/cancelar`);
    return data;
};