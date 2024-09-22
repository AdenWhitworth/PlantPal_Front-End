import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '../../../Modals/ForgotPasswordModal/ForgotPasswordModal';
import { useChangePasswordHandlers } from '../../../Hooks/useChangePasswordHandlers';
import { FormData } from '../AthenticationTypes';

/**
 * The ForgotPassword component handles the logic for a forgot password feature.
 * It manages form data for the user's email, handles form submission, and resets
 * any error or message states. The component renders a modal with the forgot password form.
 * 
 * @component
 * @returns {JSX.Element} The rendered ForgotPassword component.
 */
const ForgotPassword = (): JSX.Element => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
    });
    const navigate = useNavigate();

    /**
     * Custom hook to handle forgot password-related logic like form submission, error management, 
     * and message handling.
     */
    const { 
        handleForgotPassword, 
        error, 
        resetError, 
        message, 
        resetMessage 
    } = useChangePasswordHandlers();

    /**
     * Handles input changes for the form by updating the corresponding state.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Handles form submission for the forgot password form.
     * It prevents the default form behavior and triggers the forgot password logic.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
     */
    const handleForgotPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleForgotPassword({
            email: formData.email,
        });
    };

    /**
     * Navigates the user back to the home page when the return action is triggered.
     */
    const handleReturnHome = () => {
        navigate('/', { replace: true });
    };

    /**
     * useEffect hook to reset any errors and messages when the component mounts.
     */
    useEffect(() => {
        resetError();
        resetMessage();
    }, [resetError, resetMessage]);

    return (
        <ForgotPasswordModal 
            handleReturnHome={handleReturnHome} 
            message={message}
            error={error}
            handleInputChange={handleInputChange}
            handleSubmit={handleForgotPasswordSubmit}
        />
    );
};

export default ForgotPassword;
