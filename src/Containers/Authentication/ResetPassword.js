import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { postResetPassword } from '../../Services/ApiService';
import ResetPasswordModal from '../../Modals/ResetPasswordModal';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get('resetToken');
    const userId = searchParams.get('user_id');

    const resetError = () => setError(null);
    const resetMessage = () => setMessage(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        resetError();
        resetMessage();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await postResetPassword({
                password: formData.password,
                resetToken: encodeURIComponent(resetToken),
                user_id: userId,
            });

            setMessage('Success resetting the password. Please log in with the new credentials.')

            handleReturnAuth();
        } catch (err) {
            setError('Error resetting password. Please try again.');
        }
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
