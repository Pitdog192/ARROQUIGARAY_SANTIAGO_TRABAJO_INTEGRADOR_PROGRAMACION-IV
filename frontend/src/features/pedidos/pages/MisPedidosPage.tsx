import { useState } from 'react';
import { usePedidos } from '../hooks/usePedidos';
import { useCancelarPedido } from '../hooks/useCancelarPedido';
import { PedidoDetalle } from '../components/PedidoDetalle';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Skeleton } from '../../../shared/components/Skeleton';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';
import { EstadoError } from '../../../shared/components/EstadoError';

export const MisPedidosPage = () => {
    const { data: pedidosData, isLoading, isError } = usePedidos({ skip: 0, limit: 50 });
    const cancelarMutation = useCancelarPedido();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (isLoading) return <Skeleton count={3} />;
    if (isError) return <EstadoError mensaje="No se pudieron cargar tus pedidos." />;

    const pedidos = pedidosData?.items ?? [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
                <p className="text-sm text-gray-500">
                    Historial de compras y seguimiento de estado
                </p>
            </div>

            {errorMsg && <EstadoError mensaje={errorMsg} />}

            {pedidos.length === 0 ? (
                <EstadoVacio
                    titulo="Todavía no realizaste pedidos"
                    descripcion="Cuando confirmes una compra desde el catálogo, aparecerá acá."
                />
            ) : (
                <div className="space-y-4">
                    {pedidos.map((pedido) => (
                        <PedidoDetalle
                            key={pedido.id}
                            pedido={pedido}
                            cancelando={cancelarMutation.isPending}
                            onCancelar={async (id) => {
                                setErrorMsg(null);
                                try {
                                    await cancelarMutation.mutateAsync(id);
                                } catch (err) {
                                    setErrorMsg(handleApiError(err));
                                }
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};