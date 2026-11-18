import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useProductos } from '../hooks/useProductos';
import { useCategorias } from '../../categorias/hooks/useCategorias';
import { ProductoCard } from '../components/ProductoCard';
import { Paginacion } from '../../../shared/components/Paginacion';
import { Skeleton } from '../../../shared/components/Skeleton';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';
import { EstadoError } from '../../../shared/components/EstadoError';

const LIMIT = 6;

export const CatalogoPage = () => {
    const [search, setSearch] = useState('');
    const [categoriaId, setCategoriaId] = useState<number | null>(null);
    const [page, setPage] = useState(0);

    const { data: categorias = [] } = useCategorias();
    const {
        data: productosData,
        isLoading,
        isError,
    } = useProductos({
        skip: page * LIMIT,
        limit: LIMIT,
        search,
        categoria_id: categoriaId,
    });

    const productos = productosData?.items ?? [];
    const total = productosData?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 sm:p-8 text-white">
                <h1 className="text-3xl font-extrabold">Catálogo de Comidas</h1>
                <p className="mt-1 text-orange-100 text-sm">
                    Explorá nuestros platos, filtrá por categoría y armá tu pedido.
                </p>

                <div className="mt-5 relative max-w-xl">
                    <Search className="h-5 w-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        placeholder="Buscar productos por nombre..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <span className="flex items-center gap-1 text-sm font-semibold text-gray-500 mr-2">
                    <Filter className="h-4 w-4" /> Categorías:
                </span>
                <button
                    onClick={() => {
                        setCategoriaId(null);
                        setPage(0);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer ${categoriaId === null
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-200'
                        }`}
                >
                    Todas
                </button>
                {categorias.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setCategoriaId(cat.id);
                            setPage(0);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer ${categoriaId === cat.id
                                ? 'bg-orange-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-200'
                            }`}
                    >
                        {cat.nombre}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <Skeleton count={6} />
            ) : isError ? (
                <EstadoError mensaje="No se pudo cargar el catálogo de productos." />
            ) : productos.length === 0 ? (
                <EstadoVacio
                    titulo="No se encontraron productos"
                    descripcion="Probá cambiando la búsqueda o la categoría seleccionada."
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {productos.map((prod) => (
                            <ProductoCard key={prod.id} producto={prod} />
                        ))}
                    </div>

                    <Paginacion
                        page={page}
                        totalPages={totalPages}
                        totalItems={total}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
};