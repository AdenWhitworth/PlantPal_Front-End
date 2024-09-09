import { useState } from 'react';
import { postLogin, postRegister } from '../Services/ApiService';

interface UserData {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
}

interface User {
    first_name: string;
    last_name: string;
    email: string;
    user_id: string;
}

interface UseAuthHandlersProps {
    setAccessToken: (token: string) => void;
    setUser: (user: User) => void;
    isLoginSelected: boolean;
}

export const useAuthHandlers = ({ 
    setAccessToken, 
    setUser, 
    isLoginSelected
 }: UseAuthHandlersProps) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateForm = (userData: UserData) => {
        if (!userData.email || !userData.password) {
            setError('Email and password are required.');
        return false;
        }
        if (!isLoginSelected && (!userData.first_name || !userData.last_name)) {
            setError('First name and last name are required for sign up.');
        return false;
        }
        return true;
    };

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement> | null, userData: UserData, onSuccess?: (accessToken: string) => void) => {
        if (e) e.preventDefault();
        resetError();
        if (!validateForm(userData)) return;
            setIsLoading(true);
        try {
            const { data } = await postLogin(userData);
            setAccessToken(data.accessToken);
            setUser(data.user);
            if (onSuccess) onSuccess(data.accessToken);
        } catch (error: unknown) {
            let errorMessage = 'An unexpected error occurred. Please try again later.';

            if (error instanceof Error && error.hasOwnProperty('response')) {
                const axiosError = error as any;

                errorMessage = 
                    axiosError.response?.data?.errors?.email ||
                    axiosError.response?.data?.errors?.password ||
                    axiosError.response?.data?.message ||
                    'Invalid email or password';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>, userData: UserData, onSuccess?: (accessToken: string) => void) => {
        e.preventDefault();
        resetError();
        if (!validateForm(userData)) return;
            setIsLoading(true);
        try {
            await postRegister(userData);
            await handleSignIn(null, userData, onSuccess);
        } catch (error: any) {
            setError(error.response?.data?.message?.msg || 'Registration failed. Please try again.');
            setIsLoading(false);
        }
    };

    const resetError = () => setError(null);

    return { handleSignIn, handleSignUp, error, resetError, isLoading };
};
  