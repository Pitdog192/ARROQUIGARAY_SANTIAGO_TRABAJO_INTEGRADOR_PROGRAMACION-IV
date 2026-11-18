import { useState } from 'react';
import { usePedidos } from '../hooks/usePedidos';
import { useCambiarEstadoPedido } from '../hooks/useCambiarEstadoPedido';
import { PedidosTable } from '../components/PedidosTable';
import type { EstadoPedido } from '../types';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Skeleton } from '../../../shared/components/Skeleton';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';
import { EstadoError } from '../../../shared/components/EstadoError';

export const AdminPedidosPage = () => {
    const [estadoFiltro, setEstadoFiltro] = useState<EstadoPedido | ''>('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { data: pedidosData, isLoading, isError } = usePedidos({
        skip: 0,
        limit: 100,
        estado: estadoFiltro,
    });

    const cambiarEstadoMutation = useCambiarEstadoPedido();

    const pedidos = pedidosData?.items ?? [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
                    <p className="text-sm text-gray-500">
                        Avanzá o cancelá pedidos según la máquina de estados
                    </p>
                </div>

                <select
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value as EstadoPedido | '')}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium"
                >
                    <option value="">Todos los estados</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="EN_PREPARACION">EN PREPARACIÓN</option>
                    <option value="ENTREGADO">ENTREGADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                </select>
            </div>

            {errorMsg && <EstadoError mensaje={errorMsg} />}

            {isLoading ? (
                <Skeleton count={4} />
            ) : isError ? (
                <EstadoError mensaje="Error al cargar el listado de pedidos." />
            ) : pedidos.length === 0 ? (
                <EstadoVacio titulo="No hay pedidos para el filtro seleccionado" />
            ) : (
                <PedidosTable
                    pedidos={pedidos}
                    isUpdating={cambiarEstadoMutation.isPending}
                    onCambiarEstado={async (id, estado) => {
                        setErrorMsg(null);
                        try {
                            await cambiarEstadoMutation.mutateAsync({ id, estado });
                        } catch (err) {
                            setErrorMsg(handleApiError(err));
                        }
                    }}
                />
            )}
        </div>
    );
};