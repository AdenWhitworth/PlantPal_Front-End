import React, { useState, useEffect } from 'react';
import { postForgotPassword } from '../../Services/ApiService';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '../../Modals/ForgotPasswordModal';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
      });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const resetError = () => setError(null);
    const resetMessage = () => setMessage(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        resetError();
        resetMessage();
        try {
            await postForgotPassword({
                email: formData.email,
            });

            setMessage('We have sent password recover instructions to your email.')

        } catch (err) {
            setError('Error sending password reset email');
        }
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
