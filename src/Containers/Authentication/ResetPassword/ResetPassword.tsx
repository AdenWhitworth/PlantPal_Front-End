import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ResetPasswordModal from '../../../Modals/ResetPasswordModal/ResetPasswordModal';
import { useChangePasswordHandlers } from '../../../Hooks/useChangePasswordHandlers';

interface FormData  {
    password: string;
    confirmPassword: string;
}

const ResetPassword = () => {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleResetPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(!resetToken && !userId){
            handleReturnHome();
            return;
        }
        
        handlePasswordReset({
            password: formData.password,
            resetToken: encodeURIComponent(resetToken || ''),
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
