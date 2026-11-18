import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore} from '../store/authStore'
import type {  Role } from '../store/authStore';

interface Props {
    allowedRoles?: Role[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
    const { usuario, cargando } = useAuthStore();

    if (cargando) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
            </div>
        );
    }

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(usuario.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};