import type { Role } from '../../../store/authStore';

export interface UserCreate {
    username: string;
    full_name: string;
    email: string;
    password: string;
}

export interface UserPublic {
    id: number;
    username: string;
    full_name: string;
    email: string;
    role: Role;
    disabled: boolean;
    created_at?: string;
}