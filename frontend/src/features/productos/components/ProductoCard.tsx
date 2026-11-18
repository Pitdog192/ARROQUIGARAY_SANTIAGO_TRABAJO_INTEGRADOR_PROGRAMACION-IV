import { ShoppingCart, Utensils, Check } from 'lucide-react';
import type { Producto } from '../types';
import { useCartStore } from '../../../store/cartStore';
import { Card } from '../../../shared/ui/Card';

interface Props {
    producto: Producto;
}

export const ProductoCard = ({ producto }: Props) => {
    const { items, agregar } = useCartStore();
    const enCarrito = items.find((i) => i.producto_id === producto.id)?.cantidad ?? 0;
    const sinStock = !producto.disponible || producto.stock <= 0;
    const topeAlcanzado = enCarrito >= producto.stock;

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
        }).format(price);

    return (
        <Card className="overflow-hidden flex flex-col hover:shadow-md transition">
            <div className="relative h-48 bg-orange-50 flex items-center justify-center overflow-hidden">
                {producto.imagen_url ? (
                    <img
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Utensils className="h-14 w-14 text-orange-200" />
                )}

                {producto.categoria && (
                    <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full">
                        {producto.categoria.nombre}
                    </span>
                )}

                <span
                    className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${sinStock ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                        }`}
                >
                    {sinStock ? 'Sin stock' : `Stock: ${producto.stock}`}
                </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{producto.nombre}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 min-h-[2.5rem]">
                        {producto.descripcion || 'Sin descripción adicional.'}
                    </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div>
                        <span className="text-xs text-gray-400 block">Precio</span>
                        <span className="text-xl font-extrabold text-gray-900">
                            {formatPrice(producto.precio_base)}
                        </span>
                    </div>

                    <button
                        onClick={() => agregar(producto, 1)}
                        disabled={sinStock || topeAlcanzado}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer ${sinStock
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : topeAlcanzado
                                    ? 'bg-amber-100 text-amber-800 cursor-not-allowed'
                                    : 'bg-orange-600 text-white hover:bg-orange-700'
                            }`}
                    >
                        {sinStock ? (
                            <span>No disponible</span>
                        ) : topeAlcanzado ? (
                            <>
                                <Check className="h-4 w-4" />
                                <span>Máx ({enCarrito})</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="h-4 w-4" />
                                <span>Agregar al carrito {enCarrito > 0 ? `(${enCarrito})` : ''}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Card>
    );
};