import React, { useState, useEffect  } from 'react';
import { useAuth } from '../../../Provider/AuthProvider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useSettingsHandlers } from '../../../Hooks/useSettingsHandlers';
import AccountForm from './AccountForm/AccountForm';
import "./Account.css";
import { UserDetails } from './AccountTypes';

/**
 * Account component for managing user account settings.
 *
 * @component
 * @returns {JSX.Element} The rendered Account component.
 */
export default function Account(): JSX.Element {
  const [editToggle, setEditToggle] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const { accessToken, setUser, setAccessToken } = useAuth();
  const { handleUpdateUser, error, resetError} = useSettingsHandlers();
  const navigate = useNavigate();

  /**
   * Handles changes to input fields and updates userDetails state.
   *
   * @function
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles the save button click event and updates the user details.
   *
   * @function
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
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

  /**
   * Enables editing by setting input fields to be editable.
   * 
   * @function
   */
  const handleEditClick = () => {
    setInputDisabled(false);
    setEditToggle(true);
  };

  /**
   * Closes the edit mode and disables input fields.
   * 
   * @function
   */
  const handleCloseClick = () => {
    setInputDisabled(true);
    setEditToggle(false);
  };

  /**
   * Navigates to the forgot password page.
   * 
   * @function
   */
  const handleReturnForgotPassword = () => {
    navigate('/forgotPassword', { replace: true });
  };
  
  /**
   * Reset error state on component mount.
   */
  useEffect(() => {
    resetError();
  }, [resetError]);

  return (
    <div className='dashboard-account'>
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
    </div>
  );
}
