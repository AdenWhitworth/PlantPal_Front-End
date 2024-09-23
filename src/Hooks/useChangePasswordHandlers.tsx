import { useState, useCallback } from 'react';
import { postResetPassword, postForgotPassword } from '../Services/ApiService/ApiService';

interface UserData {
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    resetToken?: string;
    user_id?: string;
}

export const useChangePasswordHandlers = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    const validateForgotForm = (userData: UserData) => {
        if (!userData.email) {
            setError('Email is required.');
            return false;
        }
        return true;
    };

    const validateResetForm = (userData: UserData, confirmPassword: string) => {
        if (!userData.password || !userData.resetToken || !userData.user_id) {
            setError('Password, resetToken, and user id are required.');
            return false;
        }

        if (userData.password !== confirmPassword){
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleForgotPassword = async (userData: UserData) => {
        resetError();
        resetMessage();
        if (!validateForgotForm(userData)) return;
        setIsLoading(true);
        try {
            await postForgotPassword(userData);

            setMessage('We have sent password recover instructions to your email.')

        } catch (err) {
            setError('Error sending password reset email');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (userData: UserData, confirmPassword: string, onSuccess?: () => void) => {
        resetError();
        resetMessage();
        if (!validateResetForm(userData, confirmPassword)) return;
        setIsLoading(true);
        try {
            await postResetPassword(userData);
            setMessage('Success resetting the password. Please log in with the new credentials.')
            if (onSuccess) onSuccess();
        } catch (err) {
            setError('Error resetting password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    const resetMessage = useCallback(() => {
        setMessage(null);
    }, []);

    return { handleForgotPassword, handlePasswordReset, error, resetError, message, resetMessage, isLoading };
};