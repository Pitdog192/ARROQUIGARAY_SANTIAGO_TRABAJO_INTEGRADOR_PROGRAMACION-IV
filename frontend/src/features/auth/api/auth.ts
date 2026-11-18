import { axiosInstance } from '../../../shared/api/axiosInstance';
import type { UserCreate, UserPublic } from '../types';

export const registerUser = async (payload: UserCreate): Promise<UserPublic> => {
    const { data } = await axiosInstance.post<UserPublic>('/auth/register', payload);
    return data;
};