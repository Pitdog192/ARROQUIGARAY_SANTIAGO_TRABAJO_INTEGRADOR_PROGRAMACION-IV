import { useMemo, useState } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { UserCheck, UserX } from 'lucide-react';
import {
    useUsuarios,
    useActivarUsuario,
    useDesactivarUsuario,
} from '../hooks/useUsuarios';
import { UsuarioAdmin } from '../types';
import { useAuthStore } from '../../../store/authStore';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Skeleton } from '../../../shared/components/Skeleton';
import { EstadoError } from '../../../shared/components/EstadoError';

const columnHelper = createColumnHelper<UsuarioAdmin>();

export const AdminUsuariosPage = () => {
    const { usuario: currentUser } = useAuthStore();
    const { data: usuarios = [], isLoading, isError } = useUsuarios();
    const activarMutation = useActivarUsuario();
    const desactivarMutation = useDesactivarUsuario();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const columns = useMemo(
        () => [
            columnHelper.accessor('username', {
                header: 'Username',
                cell: (info) => <span className="font-bold text-gray-900">{info.getValue()}</span>,
            }),
            columnHelper.accessor('full_name', {
                header: 'Nombre',
                cell: (info) => <span className="text-gray-700">{info.getValue()}</span>,
            }),
            columnHelper.accessor('email', {
                header: 'Email',
                cell: (info) => <span className="text-gray-500">{info.getValue()}</span>,
            }),
            columnHelper.accessor('role', {
                header: 'Rol',
                cell: (info) => (
                    <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${info.getValue() === 'admin'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                    >
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('disabled', {
                header: 'Estado',
                cell: (info) => (
                    <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${info.getValue()
                                ? 'bg-red-100 text-red-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                    >
                        {info.getValue() ? 'Desactivado' : 'Activo'}
                    </span>
                ),
            }),
            columnHelper.display({
                id: 'acciones',
                header: 'Acción',
                cell: ({ row }) => {
                    const u = row.original;
                    const esSesionActual = currentUser?.id === u.id;

                    if (esSesionActual) {
                        return <span className="text-xs text-gray-400 italic">Sesión actual</span>;
                    }

                    return u.disabled ? (
                        <Button
                            variant="primary"
                            onClick={async () => {
                                setErrorMsg(null);
                                try {
                                    await activarMutation.mutateAsync(u.id);
                                } catch (err) {
                                    setErrorMsg(handleApiError(err));
                                }
                            }}
                            className="text-xs py-1 px-3 bg-emerald-600 hover:bg-emerald-700"
                        >
                            <UserCheck className="h-3.5 w-3.5" /> Activar
                        </Button>
                    ) : (
                        <Button
                            variant="danger"
                            onClick={async () => {
                                setErrorMsg(null);
                                try {
                                    await desactivarMutation.mutateAsync(u.id);
                                } catch (err) {
                                    setErrorMsg(handleApiError(err));
                                }
                            }}
                            className="text-xs py-1 px-3"
                        >
                            <UserX className="h-3.5 w-3.5" /> Desactivar
                        </Button>
                    );
                },
            }),
        ],
        [currentUser, activarMutation, desactivarMutation]
    );

    const table = useReactTable({
        data: usuarios,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 10 },
        },
    });

    if (isLoading) return <Skeleton count={3} />;
    if (isError) return <EstadoError mensaje="Error al cargar la lista de usuarios." />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                <p className="text-sm text-gray-500">Activación y desactivación de cuentas</p>
            </div>

            {errorMsg && <EstadoError mensaje={errorMsg} />}

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
            </Card>
        </div>
    );
};