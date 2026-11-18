import { useMemo } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { ChefHat, CheckCircle, XCircle } from 'lucide-react';
import type { EstadoPedido, Pedido } from '../types';
import { BadgeEstado } from '../../../shared/ui/BadgeEstado';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';

interface Props {
    pedidos: Pedido[];
    onCambiarEstado: (id: number, nuevoEstado: EstadoPedido) => void;
    isUpdating: boolean;
}

const columnHelper = createColumnHelper<Pedido>();

export const PedidosTable = ({ pedidos, onCambiarEstado, isUpdating }: Props) => {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
        }).format(price);

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: (info) => <span className="font-bold text-gray-900">#{info.getValue()}</span>,
            }),
            columnHelper.accessor('usuario_id', {
                header: 'Usuario',
                cell: (info) => <span className="text-gray-600">Cliente #{info.getValue()}</span>,
            }),
            columnHelper.display({
                id: 'items_detalle',
                header: 'Ítems y Entrega',
                cell: ({ row }) => {
                    const p = row.original;
                    return (
                        <div className="space-y-1 text-xs">
                            <p className="font-semibold text-gray-800">
                                {p.items.map((i) => `${i.cantidad}x ${i.nombre_producto}`).join(', ')}
                            </p>
                            <p className="text-gray-500">
                                {p.direccion_entrega} ({p.forma_pago})
                            </p>
                        </div>
                    );
                },
            }),
            columnHelper.accessor('total', {
                header: 'Total',
                cell: (info) => (
                    <span className="font-extrabold text-orange-600">
                        {formatPrice(info.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor('estado', {
                header: 'Estado',
                cell: (info) => <BadgeEstado estado={info.getValue()} />,
            }),
            columnHelper.display({
                id: 'acciones',
                header: 'Transiciones (RN-02)',
                cell: ({ row }) => {
                    const p = row.original;
                    if (p.estado === 'PENDIENTE') {
                        return (
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => onCambiarEstado(p.id, 'EN_PREPARACION')}
                                    disabled={isUpdating}
                                    className="text-xs py-1 px-2.5 bg-blue-600 hover:bg-blue-700"
                                >
                                    <ChefHat className="h-3.5 w-3.5" /> Preparar
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => onCambiarEstado(p.id, 'CANCELADO')}
                                    disabled={isUpdating}
                                    className="text-xs py-1 px-2.5"
                                >
                                    <XCircle className="h-3.5 w-3.5" /> Cancelar
                                </Button>
                            </div>
                        );
                    }
                    if (p.estado === 'EN_PREPARACION') {
                        return (
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => onCambiarEstado(p.id, 'ENTREGADO')}
                                    disabled={isUpdating}
                                    className="text-xs py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <CheckCircle className="h-3.5 w-3.5" /> Entregar
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => onCambiarEstado(p.id, 'CANCELADO')}
                                    disabled={isUpdating}
                                    className="text-xs py-1 px-2.5"
                                >
                                    <XCircle className="h-3.5 w-3.5" /> Cancelar
                                </Button>
                            </div>
                        );
                    }
                    return <span className="text-xs text-gray-400 italic">Estado terminal</span>;
                },
            }),
        ],
        [onCambiarEstado, isUpdating]
    );

    const table = useReactTable({
        data: pedidos,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 10 },
        },
    });

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id} className="bg-gray-50 border-b border-gray-200 text-gray-600">
                                {hg.headers.map((header) => (
                                    <th key={header.id} className="py-3 px-4 font-semibold">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
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
        </Card>
    );
};