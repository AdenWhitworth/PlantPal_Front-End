import { useState } from 'react';
import { postResetPassword, postForgotPassword } from '../Services/ApiService';

export const useChangePasswordHandlers = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const validateForgotForm = (userData) => {
        if (!userData.email) {
            setError('Email is required.');
            return false;
        }
        return true;
    };

    const validateResetForm = (userData, confirmPassword) => {
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

    const handleForgotPassword = async (e, userData) => {
        
        if (e) e.preventDefault();
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

    const handlePasswordReset = async (e, userData, confirmPassword, onSuccess) => {
        
        if (e) e.preventDefault();
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

    const resetError = () => setError(null);
    const resetMessage = () => setMessage(null);

    return { handleForgotPassword, handlePasswordReset, error, resetError, message, resetMessage, isLoading };
};