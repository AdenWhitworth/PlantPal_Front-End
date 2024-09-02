import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '../../Modals/ForgotPasswordModal';
import { useChangePasswordHandlers } from '../../Hooks/useChangePasswordHandlers';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleForgotPasswordSubmit = (e) => {
        handleForgotPassword(e, {
            email: formData.email,
        })
    };

    const handleReturnHome = () => {
        navigate('/', { replace: true });
    };

    useEffect(() => {
        resetError();
        resetMessage();
    },[]);

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
