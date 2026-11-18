import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Card } from '../../../shared/ui/Card';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { EstadoError } from '../../../shared/components/EstadoError';

export const LoginPage = () => {
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const loggedUser = await login(value.username.trim(), value.password);
                if (loggedUser.role === 'admin') {
                    navigate('/admin/resumen');
                } else {
                    navigate('/');
                }
            } catch (error) {
                setServerError(handleApiError(error));
            }
        },
    });

    return (
        <Card className="max-w-md mx-auto mt-10 p-8">
            <div className="flex flex-col items-center mb-6">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600 mb-3">
                    <LogIn className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
                <p className="text-sm text-gray-500 mt-1">Ingresá tus credenciales para continuar</p>
            </div>

            {serverError && (
                <div className="mb-4">
                    <EstadoError mensaje={serverError} />
                </div>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4"
            >
                <form.Field
                    name="username"
                    validators={{
                        onChange: ({ value }) =>
                            !value.trim() ? 'El nombre de usuario es obligatorio' : undefined,
                    }}
                    children={(field) => (
                        <Input
                            label="Usuario"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Ej: admin o cliente1"
                            error={field.state.meta.errors.filter(Boolean).join(', ')}
                        />
                    )}
                />

                <form.Field
                    name="password"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? 'La contraseña es obligatoria' : undefined,
                    }}
                    children={(field) => (
                        <Input
                            label="Contraseña"
                            type="password"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="••••••••"
                            error={field.state.meta.errors.filter(Boolean).join(', ')}
                        />
                    )}
                />

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full py-2.5">
                            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                        </Button>
                    )}
                />
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
                ¿No tenés una cuenta?{' '}
                <Link to="/register" className="text-orange-600 font-semibold hover:underline">
                    Registrate acá
                </Link>
            </p>
        </Card>
    );
};