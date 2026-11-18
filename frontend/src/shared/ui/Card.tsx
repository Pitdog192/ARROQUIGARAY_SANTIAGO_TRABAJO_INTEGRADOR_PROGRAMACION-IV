import { ReactNode } from 'react';

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-2xs ${className}`}>
        {children}
    </div>
);