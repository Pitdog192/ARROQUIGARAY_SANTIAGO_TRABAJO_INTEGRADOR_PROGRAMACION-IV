import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { registerUser } from '../api/auth';
import { useAuthStore } from '../../../store/authStore';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Card } from '../../../shared/ui/Card';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { EstadoError } from '../../../shared/components/EstadoError';

export const RegisterPage = () => {
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            username: '',
            full_name: '',
            email: '',
            password: '',
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                await registerUser({
                    username: value.username.trim(),
                    full_name: value.full_name.trim(),
                    email: value.email.trim(),
                    password: value.password,
                });
                await login(value.username.trim(), value.password);
                navigate('/');
            } catch (error) {
                setServerError(handleApiError(error));
            }
        },
    });

    return (
        <Card className="max-w-md mx-auto mt-8 p-8">
            <div className="flex flex-col items-center mb-6">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600 mb-3">
                    <UserPlus className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
                <p className="text-sm text-gray-500 mt-1">Registrate para realizar tus pedidos</p>
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
                            value.trim().length < 3 ? 'Mínimo 3 caracteres' : undefined,
                    }}
                    children={(field) => (
                        <Input
                            label="Nombre de usuario"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Ej: santiago95"
                            error={field.state.meta.errors.filter(Boolean).join(', ')}
                        />
                    )}
                />

                <form.Field
                    name="full_name"
                    validators={{
                        onChange: ({ value }) =>
                            value.trim().length < 3 ? 'Ingresá tu nombre completo' : undefined,
                    }}
                    children={(field) => (
                        <Input
                            label="Nombre completo"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Ej: Santiago Arroquigaray"
                            error={field.state.meta.errors.filter(Boolean).join(', ')}
                        />
                    )}
                />

                <form.Field
                    name="email"
                    validators={{
                        onChange: ({ value }) =>
                            !value.includes('@') ? 'Ingresá un email válido' : undefined,
                    }}
                    children={(field) => (
                        <Input
                            label="Correo electrónico"
                            type="email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="usuario@ejemplo.com"
                            error={field.state.meta.errors.filter(Boolean).join(', ')}
                        />
                    )}
                />

                <form.Field
                    name="password"
                    validators={{
                        onChange: ({ value }) =>
                            value.length < 8 ? 'La contraseña debe tener al menos 8 caracteres' : undefined,
                    }}
                    children={(field) => (
                        <Input
                            label="Contraseña"
                            type="password"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            error={field.state.meta.errors.filter(Boolean).join(', ')}
                        />
                    )}
                />

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full py-2.5">
                            {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
                        </Button>
                    )}
                />
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
                ¿Ya tenés cuenta?{' '}
                <Link to="/login" className="text-orange-600 font-semibold hover:underline">
                    Iniciá sesión
                </Link>
            </p>
        </Card>
    );
};