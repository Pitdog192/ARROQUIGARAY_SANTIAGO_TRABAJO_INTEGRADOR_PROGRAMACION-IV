import { useState, useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import {
    useProductos,
    useCrearProducto,
    useActualizarProducto,
    useCambiarStockProducto,
    useEliminarProducto,
} from '../hooks/useProductos';
import { useCategorias } from '../../categorias/hooks/useCategorias';
import { Producto } from '../types';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Card } from '../../../shared/ui/Card';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { Skeleton } from '../../../shared/components/Skeleton';
import { EstadoError } from '../../../shared/components/EstadoError';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';

const columnHelper = createColumnHelper<Producto>();

export const AdminProductosPage = () => {
    const { data: categorias = [] } = useCategorias();
    const { data: productosData, isLoading, isError } = useProductos({
        skip: 0,
        limit: 100,
    });

    const crearMutation = useCrearProducto();
    const actualizarMutation = useActualizarProducto();
    const stockMutation = useCambiarStockProducto();
    const eliminarMutation = useEliminarProducto();

    const [editingProd, setEditingProd] = useState<Producto | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            nombre: '',
            descripcion: '',
            categoria_id: 1,
            precio_base: 1000,
            stock: 10,
            imagen_url: '',
            disponible: true,
        },
        onSubmit: async ({ value }) => {
            setErrorMsg(null);
            try {
                const payload = {
                    nombre: value.nombre.trim(),
                    descripcion: value.descripcion.trim() || null,
                    categoria_id: Number(value.categoria_id),
                    precio_base: Number(value.precio_base),
                    stock: Number(value.stock),
                    imagen_url: value.imagen_url.trim() || null,
                    disponible: value.disponible,
                };
                if (editingProd) {
                    await actualizarMutation.mutateAsync({ id: editingProd.id, payload });
                } else {
                    await crearMutation.mutateAsync(payload);
                }
                setEditingProd(null);
                form.reset();
            } catch (err) {
                setErrorMsg(handleApiError(err));
            }
        },
    });

    const handleStartEdit = (prod: Producto) => {
        setEditingProd(prod);
        form.setFieldValue('nombre', prod.nombre);
        form.setFieldValue('descripcion', prod.descripcion ?? '');
        form.setFieldValue('categoria_id', prod.categoria_id);
        form.setFieldValue('precio_base', prod.precio_base);
        form.setFieldValue('stock', prod.stock);
        form.setFieldValue('imagen_url', prod.imagen_url ?? '');
        form.setFieldValue('disponible', prod.disponible);
    };

    const productos = productosData?.items ?? [];

    const columns = useMemo(
        () => [
            columnHelper.accessor('nombre', {
                header: 'Producto',
                cell: ({ row }) => (
                    <div>
                        <p className="font-bold text-gray-900">{row.original.nombre}</p>
                        <p className="text-xs text-gray-400">
                            {row.original.categoria?.nombre ?? `Categoría #${row.original.categoria_id}`}
                        </p>
                    </div>
                ),
            }),
            columnHelper.accessor('precio_base', {
                header: 'Precio',
                cell: (info) => <span className="font-semibold">${info.getValue()}</span>,
            }),
            columnHelper.display({
                id: 'stock_control',
                header: 'Stock',
                cell: ({ row }) => {
                    const prod = row.original;
                    return (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    stockMutation.mutate({
                                        id: prod.id,
                                        payload: {
                                            stock: Math.max(0, prod.stock - 1),
                                            disponible: prod.disponible,
                                        },
                                    })
                                }
                                className="px-2 py-0.5 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                            >
                                -
                            </button>
                            <span className="font-bold w-8 text-center">{prod.stock}</span>
                            <button
                                onClick={() =>
                                    stockMutation.mutate({
                                        id: prod.id,
                                        payload: {
                                            stock: prod.stock + 1,
                                            disponible: prod.disponible,
                                        },
                                    })
                                }
                                className="px-2 py-0.5 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    );
                },
            }),
            columnHelper.display({
                id: 'disponibilidad',
                header: 'Disponibilidad',
                cell: ({ row }) => {
                    const prod = row.original;
                    return (
                        <button
                            onClick={() =>
                                stockMutation.mutate({
                                    id: prod.id,
                                    payload: { stock: prod.stock, disponible: !prod.disponible },
                                })
                            }
                            className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer ${prod.disponible
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            {prod.disponible ? 'Disponible' : 'No disponible'}
                        </button>
                    );
                },
            }),
            columnHelper.display({
                id: 'acciones',
                header: 'Acciones',
                cell: ({ row }) => (
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => handleStartEdit(row.original)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                            title="Editar"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => eliminarMutation.mutate(row.original.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                            title="Baja lógica"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ),
            }),
        ],
        [stockMutation, eliminarMutation]
    );

    const table = useReactTable({
        data: productos,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 10 },
        },
    });

    if (isLoading) return <Skeleton count={4} />;
    if (isError) return <EstadoError mensaje="Error al cargar los productos." />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
                <p className="text-sm text-gray-500">
                    ABM de productos, control de stock y disponibilidad
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-lg text-gray-900">
                            {editingProd ? `Editar: ${editingProd.nombre}` : 'Nuevo Producto'}
                        </h2>
                        {editingProd && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingProd(null);
                                    form.reset();
                                }}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {errorMsg && <EstadoError mensaje={errorMsg} />}

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-3 text-sm"
                    >
                        <form.Field
                            name="nombre"
                            validators={{
                                onChange: ({ value }) =>
                                    value.trim().length < 2 ? 'El nombre es obligatorio' : undefined,
                            }}
                            children={(field) => (
                                <Input
                                    label="Nombre *"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors.filter(Boolean).join(', ')}
                                />
                            )}
                        />

                        <form.Field
                            name="categoria_id"
                            children={(field) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoría *
                                    </label>
                                    <select
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                                    >
                                        {categorias.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <form.Field
                                name="precio_base"
                                validators={{
                                    onChange: ({ value }) =>
                                        Number(value) < 0 ? 'El precio debe ser >= 0' : undefined,
                                }}
                                children={(field) => (
                                    <Input
                                        label="Precio ($) *"
                                        type="number"
                                        step="0.01"
                                        value={String(field.state.value)}
                                        onChange={(e) => field.handleChange(Number(e.target.value))}
                                        error={field.state.meta.errors.filter(Boolean).join(', ')}
                                    />
                                )}
                            />

                            <form.Field
                                name="stock"
                                validators={{
                                    onChange: ({ value }) =>
                                        Number(value) < 0 ? 'El stock debe ser >= 0' : undefined,
                                }}
                                children={(field) => (
                                    <Input
                                        label="Stock *"
                                        type="number"
                                        value={String(field.state.value)}
                                        onChange={(e) => field.handleChange(Number(e.target.value))}
                                        error={field.state.meta.errors.filter(Boolean).join(', ')}
                                    />
                                )}
                            />
                        </div>

                        <form.Field
                            name="descripcion"
                            children={(field) => (
                                <Input
                                    label="Descripción"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            )}
                        />

                        <form.Field
                            name="imagen_url"
                            children={(field) => (
                                <Input
                                    label="URL de Imagen"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="https://..."
                                />
                            )}
                        />

                        <form.Field
                            name="disponible"
                            children={(field) => (
                                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.checked)}
                                        className="h-4 w-4 accent-orange-600 rounded"
                                    />
                                    <span className="font-medium text-gray-700">Disponible para la venta</span>
                                </label>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            <Plus className="h-4 w-4" />
                            <span>{editingProd ? 'Guardar Cambios' : 'Crear Producto'}</span>
                        </Button>
                    </form>
                </Card>

                <Card className="lg:col-span-2 overflow-hidden">
                    {productos.length === 0 ? (
                        <EstadoVacio titulo="No hay productos registrados" />
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        {table.getHeaderGroups().map((hg) => (
                                            <tr
                                                key={hg.id}
                                                className="bg-gray-50 border-b border-gray-200 text-gray-600"
                                            >
                                                {hg.headers.map((header) => (
                                                    <th key={header.id} className="py-3 px-4 font-semibold">
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {table.getRowModel().rows.map((row) => (
                                            <tr key={row.id} className="hover:bg-gray-50/60">
                                                {row.getVisibleCells().map((cell) => (
                                                    <td key={cell.id} className="py-3 px-4">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                                <span>
                                    Página {table.getState().pagination.pageIndex + 1} de{' '}
                                    {table.getPageCount()}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
};