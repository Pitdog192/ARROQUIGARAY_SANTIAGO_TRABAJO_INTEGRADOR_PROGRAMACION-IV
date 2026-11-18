import type { Role } from '../../../store/authStore';

export interface UsuarioAdmin {
    id: number;
    username: string;
    full_name: string;
    email: string;
    role: Role;
    disabled: boolean;
    created_at?: string;
}