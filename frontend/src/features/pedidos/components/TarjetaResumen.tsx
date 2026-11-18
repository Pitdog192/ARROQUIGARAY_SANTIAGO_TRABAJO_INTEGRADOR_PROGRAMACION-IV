import type { ReactNode } from 'react';
import { Card } from '../../../shared/ui/Card';

interface Props {
    titulo: string;
    valor: string | number;
    icono: ReactNode;
    colorClass?: string;
}

export const TarjetaResumen = ({
    titulo,
    valor,
    icono,
    colorClass = 'text-orange-600',
}: Props) => (
    <Card className="p-5 flex flex-col justify-between">
        <div className={`flex items-center justify-between ${colorClass} mb-2`}>
            <span className="text-xs font-bold uppercase tracking-wide">{titulo}</span>
            {icono}
        </div>
        <p className="text-2xl font-extrabold text-gray-900 truncate">{valor}</p>
    </Card>
);