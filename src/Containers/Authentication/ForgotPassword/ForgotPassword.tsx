import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '../../../Modals/ForgotPasswordModal/ForgotPasswordModal';
import { useChangePasswordHandlers } from '../../../Hooks/useChangePasswordHandlers';

interface FormData  {
    email: string;
}

const ForgotPassword = () => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
    });
    const navigate = useNavigate();
    const { 
        handleForgotPassword, 
        error, 
        resetError, 
        message, 
        resetMessage 
    } = useChangePasswordHandlers();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleForgotPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        handleForgotPassword({
            email: formData.email,
        })
    };

    const handleReturnHome = () => {
        navigate('/', { replace: true });
    };

    useEffect(() => {
        resetError();
        resetMessage();
    },[resetError, resetMessage]);

    return (

        <ForgotPasswordModal 
            handleReturnHome={handleReturnHome} 
            message={message}
            error={error}
            handleInputChange={handleInputChange}
            handleSubmit={handleForgotPasswordSubmit}
        ></ForgotPasswordModal>
        
    );
};

export default ForgotPassword;
