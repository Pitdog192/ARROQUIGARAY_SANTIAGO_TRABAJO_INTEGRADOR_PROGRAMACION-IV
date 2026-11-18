import { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    children: ReactNode;
}

export const Button = ({ variant = 'primary', className = '', children, ...props }: Props) => {
    const styles = {
        primary: 'bg-orange-600 text-white hover:bg-orange-700',
        secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    };

    return (
        <button
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2 ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};