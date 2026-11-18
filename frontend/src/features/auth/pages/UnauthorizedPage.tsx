import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Card } from '../../../shared/ui/Card';

export const UnauthorizedPage = () => (
    <Card className="max-w-md mx-auto mt-12 p-8 text-center space-y-4">
        <div className="bg-red-100 text-red-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Acceso no autorizado</h1>
        <p className="text-sm text-gray-600">
            No contás con los permisos necesarios para acceder a esta sección.
        </p>
        <Link
            to="/"
            className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-700 transition text-sm"
        >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
        </Link>
    </Card>
);