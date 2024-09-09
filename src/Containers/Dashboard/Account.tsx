import React, { useState, useEffect  } from 'react';
import "../../App.css";
import { useAuth } from '../../Provider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useSettingsHandlers } from '../../Hooks/useSettingsHandlers';
import AccountForm from './AccountForm';

interface UserDetails  {
  firstName: string;
  lastName: string;
  email: string;
}

export default function Account() {
  const [editToggle, setEditToggle] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const { accessToken, setUser, setAccessToken } = useAuth();
  const { handleUpdateUser, error, resetError} = useSettingsHandlers();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveClick = (e: React.FormEvent<HTMLFormElement>) => {
    handleUpdateUser(e, accessToken, setAccessToken, {
      email: userDetails.email,
      first_name: userDetails.firstName,
      last_name: userDetails.lastName,
    }, (updatedUserData: any) => {
      setUser({
        first_name: updatedUserData.user.first_name,
        last_name: updatedUserData.user.last_name,
        email: updatedUserData.user.email,
        user_id: updatedUserData.user_id,
      });
      setInputDisabled(true);
      setEditToggle(false);
    });
  };

  const handleEditClick = () => {
    setInputDisabled(false);
    setEditToggle(true);
  };

  const handleCloseClick = () => {
    setInputDisabled(true);
    setEditToggle(false);
  };

  const handleReturnForgotPassword = () => {
    navigate('/forgotPassword', { replace: true });
  };

  useEffect(() => {
    resetError();
  }, [resetError]);

  return (
    <AccountForm
      handleSaveClick={handleSaveClick} 
      handleReturnForgotPassword={handleReturnForgotPassword}
      handleInputChange={handleInputChange}
      error={error}
      handleEditClick={handleEditClick}
      editToggle={editToggle}
      inputDisabled={inputDisabled}
      handleCloseClick={handleCloseClick}
    ></AccountForm>
  );
}
