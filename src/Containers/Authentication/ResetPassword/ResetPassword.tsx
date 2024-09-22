import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ResetPasswordModal from '../../../Modals/ResetPasswordModal/ResetPasswordModal';
import { useChangePasswordHandlers } from '../../../Hooks/useChangePasswordHandlers';
import { FormData } from '../AthenticationTypes';

/**
 * Component for resetting the user's password.
 *
 * This component manages the state for the password and confirmation fields,
 * handles input changes, and submits the reset password form. It retrieves
 * the reset token and user ID from the URL parameters and utilizes the 
 * `useChangePasswordHandlers` hook for password reset functionality.
 *
 * @component
 * @returns {JSX.Element} The rendered ResetPassword component.
 */
const ResetPassword = (): JSX.Element => {
    const [formData, setFormData] = useState<FormData>({
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get('resetToken') || '';
    const userId = searchParams.get('user_id') || '';
    const { 
        handlePasswordReset, 
        error, 
        resetError, 
        message, 
        resetMessage 
    } = useChangePasswordHandlers();

    /**
     * Handles changes to the input fields by updating state.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input field.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Handles the form submission for resetting the password.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
     * @returns {Promise<void>}
     */
    const handleResetPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        if(!resetToken && !userId){
            handleReturnHome();
            return;
        }
        
        handlePasswordReset({
            password: formData.password,
            resetToken: encodeURIComponent(resetToken || ''),
            user_id: userId,
        }, formData.confirmPassword || "", () => {
            handleReturnAuth();
        });
    };

    /**
     * Navigates to the home page.
     */
    const handleReturnHome = () => {
        navigate('/', { replace: true });
    };

    /**
     * Navigates to the authentication page.
     */
    const handleReturnAuth = () => {
        navigate('/auth', { replace: true })  
    };

    /**
     * Reset error and message states on component mount.
     */
    useEffect(() => {
        resetError();
        resetMessage();
    },[resetError, resetMessage]);

    return (

        <ResetPasswordModal 
            handleReturnHome={handleReturnHome} 
            message={message}
            error={error}
            handleInputChange={handleInputChange}
            handleSubmit={handleResetPasswordSubmit}
        ></ResetPasswordModal>
    );
};

export default ResetPassword;
