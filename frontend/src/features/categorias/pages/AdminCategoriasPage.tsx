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
    useCategorias,
    useCrearCategoria,
    useActualizarCategoria,
    useEliminarCategoria,
} from '../hooks/useCategorias';
import type { Categoria } from '../types';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Card } from '../../../shared/ui/Card';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { Skeleton } from '../../../shared/components/Skeleton';
import { EstadoError } from '../../../shared/components/EstadoError';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';

const columnHelper = createColumnHelper<Categoria>();

export const AdminCategoriasPage = () => {
    const { data: categorias = [], isLoading, isError } = useCategorias();
    const crearMutation = useCrearCategoria();
    const actualizarMutation = useActualizarCategoria();
    const eliminarMutation = useEliminarCategoria();

    const [editingCat, setEditingCat] = useState<Categoria | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            nombre: '',
            descripcion: '',
        },
        onSubmit: async ({ value }) => {
            setErrorMsg(null);
            try {
                const payload = {
                    nombre: value.nombre.trim(),
                    descripcion: value.descripcion.trim() || null,
                };
                if (editingCat) {
                    await actualizarMutation.mutateAsync({ id: editingCat.id, payload });
                } else {
                    await crearMutation.mutateAsync(payload);
                }
                setEditingCat(null);
                form.reset();
            } catch (err) {
                setErrorMsg(handleApiError(err));
            }
        },
    });

    const handleStartEdit = (cat: Categoria) => {
        setEditingCat(cat);
        form.setFieldValue('nombre', cat.nombre);
        form.setFieldValue('descripcion', cat.descripcion ?? '');
    };

    const handleCancelEdit = () => {
        setEditingCat(null);
        form.reset();
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: (info) => <span className="font-mono text-xs text-gray-500">#{info.getValue()}</span>,
            }),
            columnHelper.accessor('nombre', {
                header: 'Nombre',
                cell: (info) => <span className="font-bold text-gray-900">{info.getValue()}</span>,
            }),
            columnHelper.accessor('descripcion', {
                header: 'Descripción',
                cell: (info) => (
                    <span className="text-gray-600">{info.getValue() || 'Sin descripción'}</span>
                ),
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
        [eliminarMutation]
    );

    const table = useReactTable({
        data: categorias,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 10 },
        },
    });

    if (isLoading) return <Skeleton count={3} />;
    if (isError) return <EstadoError mensaje="Error al cargar las categorías." />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
                <p className="text-sm text-gray-500">Alta, edición y baja lógica de categorías</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-lg text-gray-900">
                            {editingCat ? `Editar: ${editingCat.nombre}` : 'Nueva Categoría'}
                        </h2>
                        {editingCat && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
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
                        className="space-y-4"
                    >
                        <form.Field
                            name="nombre"
                            validators={{
                                onChange: ({ value }) =>
                                    value.trim().length < 2 || value.trim().length > 100
                                        ? 'El nombre debe tener entre 2 y 100 caracteres'
                                        : undefined,
                            }}
                            children={(field) => (
                                <Input
                                    label="Nombre *"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Ej: Hamburguesas"
                                    error={field.state.meta.errors.filter(Boolean).join(', ')}
                                />
                            )}
                        />

                        <form.Field
                            name="descripcion"
                            children={(field) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Descripción opcional..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            <Plus className="h-4 w-4" />
                            <span>{editingCat ? 'Guardar Cambios' : 'Crear Categoría'}</span>
                        </Button>
                    </form>
                </Card>

                <Card className="lg:col-span-2 overflow-hidden">
                    {categorias.length === 0 ? (
                        <EstadoVacio titulo="No hay categorías activas" />
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr
                                                key={headerGroup.id}
                                                className="bg-gray-50 border-b border-gray-200 text-gray-600"
                                            >
                                                {headerGroup.headers.map((header) => (
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