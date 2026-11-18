import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../shared/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { UnauthorizedPage } from '../features/auth/pages/UnauthorizedPage';

import { CatalogoPage } from '../features/productos/pages/CatalogoPage';
import { AdminProductosPage } from '../features/productos/pages/AdminProductosPage';

import { AdminCategoriasPage } from '../features/categorias/pages/AdminCategoriasPage';
import { AdminUsuariosPage } from '../features/usuarios/pages/AdminUsuariosPage';

import { CarritoPage } from '../features/pedidos/pages/CarritoPage';
import { CheckoutPage } from '../features/pedidos/pages/CheckoutPage';
import { MisPedidosPage } from '../features/pedidos/pages/MisPedidosPage';
import { AdminPedidosPage } from '../features/pedidos/pages/AdminPedidosPage';
import { AdminResumenPage } from '../features/pedidos/pages/AdminResumenPage';

export const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route element={<MainLayout />}>
                {/* Rutas públicas */}
                <Route path="/" element={<CatalogoPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/carrito" element={<CarritoPage />} />

                {/* Rutas de cliente autenticado */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/mis-pedidos" element={<MisPedidosPage />} />
                </Route>

                {/* Rutas de administrador */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<Navigate to="/admin/resumen" replace />} />
                    <Route path="/admin/resumen" element={<AdminResumenPage />} />
                    <Route path="/admin/pedidos" element={<AdminPedidosPage />} />
                    <Route path="/admin/productos" element={<AdminProductosPage />} />
                    <Route path="/admin/categorias" element={<AdminCategoriasPage />} />
                    <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    </BrowserRouter>
);