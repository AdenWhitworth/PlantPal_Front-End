import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ResetPasswordModal from '../../Modals/ResetPasswordModal';
import { useChangePasswordHandlers } from '../../Hooks/useChangePasswordHandlers';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get('resetToken');
    const userId = searchParams.get('user_id');
    const { 
        handlePasswordReset, 
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

    const handleResetPasswordSubmit = async (e) => {
        handlePasswordReset(e, {
            password: formData.password,
            resetToken: encodeURIComponent(resetToken),
            user_id: userId,
        }, formData.confirmPassword, () => {
            handleReturnAuth();
        });
    };

    const handleReturnHome = () => {
        navigate('/', { replace: true });
    };

    const handleReturnAuth = () => {
        navigate('/auth', { replace: true })  
    };

    useEffect(() => {
        resetError();
        resetMessage();
    },[]);

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
