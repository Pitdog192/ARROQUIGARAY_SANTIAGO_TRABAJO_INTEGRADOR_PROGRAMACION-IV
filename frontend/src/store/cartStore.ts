import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Producto } from '../features/productos/types';

export interface CartItem {
    producto_id: number;
    nombre: string;
    precio_unitario: number;
    cantidad: number;
    stock: number;
}

interface CartState {
    items: CartItem[];
    agregar: (producto: Producto, cantidad?: number) => void;
    quitar: (productoId: number) => void;
    cambiarCantidad: (productoId: number, cantidad: number) => void;
    vaciar: () => void;
    total: () => number;
    cantidadTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            agregar: (producto, cantidad = 1) => {
                if (!producto.disponible || producto.stock <= 0) return;
                const currentItems = get().items;
                const existing = currentItems.find((i) => i.producto_id === producto.id);

                if (existing) {
                    const nuevaCantidad = Math.min(existing.cantidad + cantidad, producto.stock);
                    set({
                        items: currentItems.map((i) =>
                            i.producto_id === producto.id
                                ? { ...i, cantidad: nuevaCantidad, stock: producto.stock }
                                : i
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...currentItems,
                            {
                                producto_id: producto.id,
                                nombre: producto.nombre,
                                precio_unitario: producto.precio_base,
                                cantidad: Math.min(cantidad, producto.stock),
                                stock: producto.stock,
                            },
                        ],
                    });
                }
            },

            quitar: (productoId) => {
                set({ items: get().items.filter((i) => i.producto_id !== productoId) });
            },

            cambiarCantidad: (productoId, cantidad) => {
                if (cantidad <= 0) {
                    get().quitar(productoId);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.producto_id === productoId
                            ? { ...i, cantidad: Math.min(cantidad, i.stock) }
                            : i
                    ),
                });
            },

            vaciar: () => set({ items: [] }),

            total: () =>
                get().items.reduce((acc, item) => acc + item.precio_unitario * item.cantidad, 0),

            cantidadTotal: () => get().items.reduce((acc, item) => acc + item.cantidad, 0),
        }),
        {
            name: 'foodstore-cart',
        }
    )
);