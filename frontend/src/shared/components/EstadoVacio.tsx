export const EstadoVacio = ({ titulo, descripcion }: { titulo: string; descripcion?: string }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
        <h3 className="text-lg font-bold text-gray-800">{titulo}</h3>
        {descripcion && <p className="text-sm text-gray-500 mt-1">{descripcion}</p>}
    </div>
);