import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';
import { useCrearPedido } from '../hooks/useCrearPedido';
import { CheckoutForm } from '../components/CheckoutForm';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Card } from '../../../shared/ui/Card';
import { EstadoError } from '../../../shared/components/EstadoError';

export const CheckoutPage = () => {
    const { items, total, vaciar } = useCartStore();
    const crearPedidoMutation = useCrearPedido();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (items.length === 0) {
        return <Navigate to="/carrito" replace />;
    }

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
        }).format(price);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Confirmar Pedido</h1>
                <p className="text-sm text-gray-500">
                    Completá los datos de entrega y forma de pago
                </p>
            </div>

            {errorMsg && <EstadoError mensaje={errorMsg} />}

            <Card className="p-6 space-y-4">
                <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
                    Resumen de compra
                </h2>
                <div className="divide-y divide-gray-100 text-sm">
                    {items.map((i) => (
                        <div key={i.producto_id} className="py-2 flex justify-between">
                            <span>
                                {i.cantidad}x {i.nombre}
                            </span>
                            <span className="font-semibold">
                                {formatPrice(i.precio_unitario * i.cantidad)}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-700">Total a pagar</span>
                    <span className="text-xl font-extrabold text-orange-600">
                        {formatPrice(total())}
                    </span>
                </div>
            </Card>

            <Card className="p-6">
                <CheckoutForm
                    isSubmitting={crearPedidoMutation.isPending}
                    onSubmitPedido={async (values) => {
                        setErrorMsg(null);
                        try {
                            await crearPedidoMutation.mutateAsync({
                                items: items.map((i) => ({
                                    producto_id: i.producto_id,
                                    cantidad: i.cantidad,
                                })),
                                direccion_entrega: values.direccion_entrega.trim(),
                                forma_pago: values.forma_pago,
                                notas: values.notas.trim() || null,
                            });
                            vaciar();
                            navigate('/mis-pedidos');
                        } catch (err) {
                            setErrorMsg(handleApiError(err));
                        }
                    }}
                />
            </Card>
        </div>
    );
};