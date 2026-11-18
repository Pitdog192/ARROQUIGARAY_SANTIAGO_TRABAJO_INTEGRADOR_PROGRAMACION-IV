import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export const Modal = ({ open, title, onClose, children }: Props) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-bold text-lg text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};