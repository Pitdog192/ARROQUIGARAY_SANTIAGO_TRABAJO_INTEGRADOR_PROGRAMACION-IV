import { forwardRef, InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
    ({ label, error, className = '', ...props }, ref) => (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <input
                ref={ref}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    )
);
Input.displayName = 'Input';