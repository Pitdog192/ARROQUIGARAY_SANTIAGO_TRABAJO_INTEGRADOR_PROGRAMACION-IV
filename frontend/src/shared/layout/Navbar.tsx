import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, UtensilsCrossed, LogOut, User as UserIcon, ShieldCheck, Package } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export const Navbar = () => {
    const { usuario, logout } = useAuthStore();
    const cantidadTotal = useCartStore((state) => state.cantidadTotal());
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-orange-600 font-bold text-xl">
                    <UtensilsCrossed className="h-6 w-6" />
                    <span>Food Store</span>
                </Link>

                <nav className="flex items-center gap-5 text-sm">
                    <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium">
                        Catálogo
                    </Link>

                    {usuario && (
                        <Link to="/mis-pedidos" className="flex items-center gap-1 text-gray-700 hover:text-orange-600 font-medium">
                            <Package className="h-4 w-4" />
                            <span>Mis Pedidos</span>
                        </Link>
                    )}

                    {usuario?.role === 'admin' && (
                        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                            <ShieldCheck className="h-4 w-4 text-amber-600" />
                            <Link to="/admin/resumen" className="text-amber-800 hover:underline font-semibold">Resumen</Link>
                            <Link to="/admin/pedidos" className="text-amber-800 hover:underline font-semibold">Pedidos</Link>
                            <Link to="/admin/productos" className="text-amber-800 hover:underline font-semibold">Productos</Link>
                            <Link to="/admin/categorias" className="text-amber-800 hover:underline font-semibold">Categorías</Link>
                            <Link to="/admin/usuarios" className="text-amber-800 hover:underline font-semibold">Usuarios</Link>
                        </div>
                    )}

                    <Link to="/carrito" className="relative p-2 text-gray-700 hover:text-orange-600">
                        <ShoppingCart className="h-6 w-6" />
                        {cantidadTotal > 0 && (
                            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cantidadTotal}
                            </span>
                        )}
                    </Link>

                    {usuario ? (
                        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                            <span className="flex items-center gap-1 font-semibold text-gray-700">
                                <UserIcon className="h-4 w-4 text-gray-400" />
                                {usuario.username}
                            </span>
                            <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer">
                                <LogOut className="h-4 w-4" /> Salir
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                            <Link to="/login" className="font-medium text-gray-700 hover:text-orange-600">Ingresar</Link>
                            <Link to="/registro" className="font-medium bg-orange-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-orange-700">
                                Registrarse
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};