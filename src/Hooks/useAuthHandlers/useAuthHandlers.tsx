import { useState, useCallback } from 'react';
import { postLogin, postRegister } from '../../Services/ApiService/ApiService';
import { UserData, UseAuthHandlersProps } from './useAuthHandlersTypes';

/**
 * Custom hook to handle authentication logic, including sign in and sign up functionality.
 * 
 * @param {UseAuthHandlersProps} props - The properties passed to the authentication handler hook.
 * @returns {object} - The object containing handler functions and authentication states.
 * @returns {function} handleSignIn - Function to handle the sign in process.
 * @returns {function} handleSignUp - Function to handle the sign up process.
 * @returns {function} validateForm - Function to validate the input form before submitting.
 * @returns {string|null} error - Error message string, if an error occurs during the authentication process.
 * @returns {function} resetError - Function to reset the error state to null.
 * @returns {boolean} isLoading - Loading state indicating if the authentication request is in progress.
 */
export const useAuthHandlers = ({ 
    setAccessToken, 
    setUser, 
    isLoginSelected
 }: UseAuthHandlersProps) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * Validates the form data for sign in or sign up.
     * 
     * @function
     * @param {UserData} userData - The user's input data, including email, password, and optional name fields.
     * @returns {boolean} - Returns true if the form is valid, otherwise false.
     */
    const validateForm = (userData: UserData): boolean => {
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

    /**
     * Handles the sign in process, including API call and state updates.
     * 
     * @function
     * @param {React.FormEvent<HTMLFormElement>|null} e - Optional form event to prevent default submission behavior.
     * @param {UserData} userData - The user's sign in data.
     * @param {function} [onSuccess] - Optional callback function to execute on successful sign in.
     */
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
    
     /**
     * Handles the sign up process and then signs in the user.
     * 
     * @function
     * @param {React.FormEvent<HTMLFormElement>} e - Form event to prevent default submission behavior.
     * @param {UserData} userData - The user's registration data.
     * @param {function} [onSuccess] - Optional callback function to execute on successful sign up.
     */
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>, userData: UserData, onSuccess?: (accessToken: string) => void) => {
        e.preventDefault();
        resetError();
        if (!validateForm(userData)) return;
            setIsLoading(true);
        try {
            await postRegister(userData);
            await handleSignIn(null, userData, onSuccess);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
            setIsLoading(false);
        }
    };

    /**
     * Resets the error state to null.
     * 
     * @function
     */
    const resetError = useCallback(() => {
        setError(null);
    }, []);

    return { handleSignIn, handleSignUp, validateForm, error, resetError, isLoading };
};
  