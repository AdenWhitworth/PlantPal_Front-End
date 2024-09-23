import { useState, useCallback } from 'react';
import { postResetPassword, postForgotPassword } from '../../Services/ApiService/ApiService';
import { UserData } from './useChangePasswordHandlersTypes';

/**
 * Custom hook for handling password change and recovery processes.
 * 
 * @returns {Object} The hook's interface.
 * @returns {Function} handleForgotPassword - Function to handle forgot password logic.
 * @returns {Function} handlePasswordReset - Function to handle password reset logic.
 * @returns {string | null} error - Error message, if any.
 * @returns {Function} resetError - Function to reset the error message.
 * @returns {string | null} message - Success message, if any.
 * @returns {Function} resetMessage - Function to reset the success message.
 * @returns {boolean} isLoading - Loading state for async operations.
 */
export const useChangePasswordHandlers = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    /**
     * Validates the forgot password form data.
     * 
     * @function
     * @param {UserData} userData - The user data containing the email.
     * @returns {boolean} True if the form is valid, otherwise false.
     */
    const validateForgotForm = (userData: UserData) => {
        if (!userData.email) {
            setError('Email is required.');
            return false;
        }
        return true;
    };

    /**
     * Validates the reset password form data.
     * 
     * @function
     * @param {UserData} userData - The user data containing the password, resetToken, and user_id.
     * @param {string} confirmPassword - The password confirmation for validation.
     * @returns {boolean} True if the form is valid, otherwise false.
     */
    const validateResetForm = (userData: UserData, confirmPassword: string): boolean => {
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

    /**
     * Handles the logic for sending a forgot password request.
     * 
     * @function
     * @param {UserData} userData - The user data containing the email.
     * @returns {Promise<void>} A promise that resolves when the request is completed.
     */
    const handleForgotPassword = async (userData: UserData): Promise<void> => {
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

    /**
     * Handles the logic for resetting the password.
     * 
     * @param {UserData} userData - The user data containing the new password and tokens.
     * @param {string} confirmPassword - The password confirmation for validation.
     * @param {Function} [onSuccess] - Optional callback to execute on successful password reset.
     * @returns {Promise<void>} A promise that resolves when the request is completed.
     */
    const handlePasswordReset = async (userData: UserData, confirmPassword: string, onSuccess?: () => void): Promise<void> => {
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

    /**
     * Resets the error message state.
     * 
     * @function
     */
    const resetError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Resets the success message state.
     * 
     * @function
     */
    const resetMessage = useCallback(() => {
        setMessage(null);
    }, []);

    return { handleForgotPassword, handlePasswordReset, error, resetError, message, resetMessage, isLoading };
};