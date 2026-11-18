import { useForm } from '@tanstack/react-form';
import { CheckCircle2 } from 'lucide-react';
import type { FormaPago } from '../types';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';

interface CheckoutValues {
    direccion_entrega: string;
    forma_pago: FormaPago;
    notas: string;
}

interface Props {
    onSubmitPedido: (values: CheckoutValues) => Promise<void>;
    isSubmitting: boolean;
}

export const CheckoutForm = ({ onSubmitPedido, isSubmitting }: Props) => {
    const form = useForm({
        defaultValues: {
            direccion_entrega: '',
            forma_pago: 'EFECTIVO' as FormaPago,
            notas: '',
        },
        onSubmit: async ({ value }) => {
            await onSubmitPedido(value);
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-4"
        >
            <form.Field
                name="direccion_entrega"
                validators={{
                    onChange: ({ value }) =>
                        value.trim().length < 5 || value.trim().length > 200
                            ? 'La dirección debe tener entre 5 y 200 caracteres'
                            : undefined,
                }}
                children={(field) => (
                    <Input
                        label="Dirección de entrega *"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Ej: Av. Lavalle 450, Zárate"
                        error={field.state.meta.errors.filter(Boolean).join(', ')}
                    />
                )}
            />

            <form.Field
                name="forma_pago"
                children={(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Forma de pago *
                        </label>
                        <select
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as FormaPago)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="EFECTIVO">Efectivo</option>
                            <option value="TRANSFERENCIA">Transferencia</option>
                        </select>
                    </div>
                )}
            />

            <form.Field
                name="notas"
                children={(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notas adicionales (opcional)
                        </label>
                        <textarea
                            rows={2}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Ej: Tocar timbre B, sin mayonesa..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full py-3">
                <CheckCircle2 className="h-5 w-5" />
                <span>{isSubmitting ? 'Confirmando pedido...' : 'Confirmar Pedido'}</span>
            </Button>
        </form>
    );
};