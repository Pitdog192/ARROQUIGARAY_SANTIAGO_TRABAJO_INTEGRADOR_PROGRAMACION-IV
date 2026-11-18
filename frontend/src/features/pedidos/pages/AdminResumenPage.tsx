import { Clock, ChefHat, CheckCircle2, XCircle, Calendar, DollarSign } from 'lucide-react';
import { useResumenPedidos } from '../hooks/useResumenPedidos';
import { TarjetaResumen } from '../components/TarjetaResumen';
import { Skeleton } from '../../../shared/components/Skeleton';
import { EstadoError } from '../../../shared/components/EstadoError';

export const AdminResumenPage = () => {
    const { data: resumen, isLoading, isError } = useResumenPedidos();

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
        }).format(price);

    if (isLoading) return <Skeleton count={6} />;
    if (isError || !resumen) {
        return <EstadoError mensaje="No se pudo obtener el resumen del panel." />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Resumen del Negocio</h1>
                <p className="text-sm text-gray-500">
                    Indicadores operativos e ingresos acumulados por pedidos entregados
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <TarjetaResumen
                    titulo="Pendientes"
                    valor={resumen.pendientes}
                    icono={<Clock className="h-5 w-5" />}
                    colorClass="text-amber-600"
                />
                <TarjetaResumen
                    titulo="En Preparación"
                    valor={resumen.en_preparacion}
                    icono={<ChefHat className="h-5 w-5" />}
                    colorClass="text-blue-600"
                />
                <TarjetaResumen
                    titulo="Entregados"
                    valor={resumen.entregados}
                    icono={<CheckCircle2 className="h-5 w-5" />}
                    colorClass="text-emerald-600"
                />
                <TarjetaResumen
                    titulo="Cancelados"
                    valor={resumen.cancelados}
                    icono={<XCircle className="h-5 w-5" />}
                    colorClass="text-red-600"
                />
                <TarjetaResumen
                    titulo="Pedidos Hoy"
                    valor={resumen.pedidos_hoy}
                    icono={<Calendar className="h-5 w-5" />}
                    colorClass="text-purple-600"
                />
                <TarjetaResumen
                    titulo="Ingresos Entregados"
                    valor={formatPrice(resumen.ingresos_entregados)}
                    icono={<DollarSign className="h-5 w-5" />}
                    colorClass="text-orange-600"
                />
            </div>
        </div>
    );
};