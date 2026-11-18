export const Skeleton = ({ count = 3 }: { count?: number }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 h-48 animate-pulse" />
        ))}
    </div>
);