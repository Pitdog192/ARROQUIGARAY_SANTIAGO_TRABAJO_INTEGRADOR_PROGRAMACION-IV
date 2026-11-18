import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';

export const CarritoPage = () => {
    const { items, cambiarCantidad, quitar, vaciar, total } = useCartStore();

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
        }).format(price);

    if (items.length === 0) {
        return (
            <Card className="p-12 text-center max-w-lg mx-auto mt-8 space-y-4">
                <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-orange-600">
                    <ShoppingBag className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tu carrito está vacío</h2>
                <p className="text-sm text-gray-500">
                    Agregá productos desde nuestro catálogo para comenzar tu pedido.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-700 transition text-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Ir al Catálogo</span>
                </Link>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mi Carrito</h1>
                    <p className="text-sm text-gray-500">Revisá las cantidades antes de continuar</p>
                </div>
                <Button variant="outline" onClick={vaciar} className="text-red-600 border-red-200">
                    <Trash2 className="h-4 w-4" /> Vaciar carrito
                </Button>
            </div>

            <Card className="divide-y divide-gray-100">
                {items.map((item) => (
                    <div
                        key={item.producto_id}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div>
                            <h3 className="font-bold text-gray-900">{item.nombre}</h3>
                            <p className="text-xs text-gray-500">
                                Unitario: {formatPrice(item.precio_unitario)} · Stock máx: {item.stock}
                            </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-5">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
                                    className="p-2 text-gray-600 hover:bg-gray-50 cursor-pointer"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-3 text-sm font-bold">{item.cantidad}</span>
                                <button
                                    onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
                                    disabled={item.cantidad >= item.stock}
                                    className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <span className="w-24 text-right font-bold text-gray-900">
                                {formatPrice(item.precio_unitario * item.cantidad)}
                            </span>

                            <button
                                onClick={() => quitar(item.producto_id)}
                                className="text-gray-400 hover:text-red-600 cursor-pointer"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </Card>

            <Card className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <span className="text-sm text-gray-500 block">Total del carrito</span>
                    <span className="text-2xl font-extrabold text-orange-600">
                        {formatPrice(total())}
                    </span>
                </div>

                <Link
                    to="/checkout"
                    className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-700 transition"
                >
                    <span>Continuar al Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </Card>
        </div>
    );
};