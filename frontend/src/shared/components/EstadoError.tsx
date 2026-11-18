import { AlertCircle } from 'lucide-react';

export const EstadoError = ({ mensaje }: { mensaje: string }) => (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>{mensaje}</span>
    </div>
);