import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    page: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (newPage: number) => void;
}

export const Paginacion = ({ page, totalPages, totalItems, onPageChange }: Props) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-gray-200">
            <span className="text-sm text-gray-600">
                Página <span className="font-bold">{page + 1}</span> de{' '}
                <span className="font-bold">{totalPages}</span> ({totalItems} registros)
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 cursor-pointer"
                >
                    <ChevronLeft className="h-4 w-4" /> Anterior
                </button>
                <button
                    onClick={() => onPageChange(page + 1 < totalPages ? page + 1 : page)}
                    disabled={page + 1 >= totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 cursor-pointer"
                >
                    Siguiente <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};