import { MapPin, CreditCard } from 'lucide-react';
import type { Pedido } from '../types';
import { Card } from '../../../shared/ui/Card';
import { BadgeEstado } from '../../../shared/ui/BadgeEstado';
import { Button } from '../../../shared/ui/Button';

interface Props {
    pedido: Pedido;
    onCancelar?: (id: number) => void;
    cancelando?: boolean;
}

export const PedidoDetalle = ({ pedido, onCancelar, cancelando }: Props) => {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
        }).format(price);

    return (
        <Card className="overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="font-extrabold text-gray-900 text-lg">
                        Pedido #{pedido.id}
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date(pedido.created_at).toLocaleString('es-AR')}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <BadgeEstado estado={pedido.estado} />
                    {pedido.estado === 'PENDIENTE' && onCancelar && (
                        <Button
                            variant="danger"
                            disabled={cancelando}
                            onClick={() => onCancelar(pedido.id)}
                            className="text-xs py-1 px-3"
                        >
                            Cancelar pedido
                        </Button>
                    )}
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="divide-y divide-gray-100">
                    {pedido.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-sm">
                            <div>
                                <span className="font-semibold text-gray-900">
                                    {item.cantidad}x {item.nombre_producto}
                                </span>
                                <span className="text-gray-400 ml-2 text-xs">
                                    ({formatPrice(item.precio_unitario)} c/u)
                                </span>
                            </div>
                            <span className="font-bold text-gray-800">
                                {formatPrice(item.subtotal)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                    <div className="space-y-1 text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                            <span>{pedido.direccion_entrega}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-400 shrink-0" />
                            <span>Pago: {pedido.forma_pago}</span>
                            {pedido.notas && (
                                <span className="text-gray-400">· Notas: "{pedido.notas}"</span>
                            )}
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="text-xs text-gray-400 block">Total</span>
                        <span className="text-xl font-extrabold text-orange-600">
                            {formatPrice(pedido.total)}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
};