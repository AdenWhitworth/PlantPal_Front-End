import { useState } from 'react';
import { postLogin, postRegister } from '../Services/ApiService';

export const useAuthHandlers = ({ setAccessToken, setUser, isLoginSelected }) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (userData) => {
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

    const handleSignIn = async (e, userData, onSuccess) => {
        e.preventDefault();
        resetError();
        if (!validateForm(userData)) return;
            setIsLoading(true);
        try {
            const { data } = await postLogin(userData);
            setAccessToken(data.accessToken);
            setUser(data.user);
            if (onSuccess) onSuccess(data.accessToken);
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e, userData, onSuccess) => {
        e.preventDefault();
        resetError();
        if (!validateForm(userData)) return;
            setIsLoading(true);
        try {
            await postRegister(userData);
            await handleSignIn(e, userData);
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
            setIsLoading(false);
        }
    };

    const resetError = () => setError(null);

    return { handleSignIn, handleSignUp, error, resetError, isLoading };
};
  