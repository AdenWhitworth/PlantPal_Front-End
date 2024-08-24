import React, { useState, useCallback } from 'react';
import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import mail from '../../Images/email-brown.svg';
import x_circle from '../../Images/x-circle-black.svg';
import user_circle from '../../Images/user-circle-brown.svg';
import tag from '../../Images/tag-brown.svg';
import gear from '../../Images/gear-grey.svg';
import "../../App.css";
import { useAuth } from '../../Provider/AuthProvider';
import axios from 'axios';

const useClient = (token) => {
  return axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
};

export default function Account() {
  const [editToggle, setEditToggle] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const { token, user, setUser } = useAuth();
  const client = useClient(token);

  const resetError = useCallback(() => {
    setError('');
    setErrorVisible(false);
}, []);

  const handleSaveClick = useCallback(async () => {
    resetError();
    try {
      const { data } = await client.post('/users/updateUser', {
        email: userDetails.email,
        first_name: userDetails.firstName,
        last_name: userDetails.lastName,
      });
      setUser({
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        email: data.user.email,
        user_id: data.user_id,
      });
      setInputDisabled(true);
      setEditToggle(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user');
      setErrorVisible(true);
    }
  }, [userDetails, client, setUser, resetError]);

  const handleEditClick = () => {
    setInputDisabled(false);
    setEditToggle(true);
  };

  const handleCloseClick = () => {
    setInputDisabled(true);
    setEditToggle(false);
  };

  const handleInputChange = (field) => (e) => {
    setUserDetails((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className='dashboard-setting'>
      <div className="account-section-2">
        
        {editToggle && (
          <div className='account-close'>
            <img className='grow' src={x_circle} alt='Close Icon' onClick={handleCloseClick} />
          </div>
        )}

        <div className='account-logo'>
          <img className="account-logo-img" src={gear} alt="Account logo" />
          <h1 className="account-logo-txt">Account</h1>
        </div>

        <InputField
          onChange={handleInputChange('firstName')}
          inputImg={user_circle}
          isRequired={true}
          type='text'
          placeholder={editToggle ? "First Name" : user.first_name}
          isSpellCheck={false}
          setWidth={'60%'}
          isDisabled={inputDisabled}
          isPrimaryStyle={editToggle}
        />

        <InputField
          onChange={handleInputChange('lastName')}
          inputImg={tag}
          isRequired={true}
          type='text'
          placeholder={editToggle ? "Last Name" : user.last_name}
          isSpellCheck={false}
          setWidth={'60%'}
          isDisabled={inputDisabled}
          isPrimaryStyle={editToggle}
        />

        <InputField
          onChange={handleInputChange('email')}
          inputImg={mail}
          isRequired={true}
          type='email'
          placeholder={editToggle ? "Email" : user.email}
          isSpellCheck={false}
          setWidth={'60%'}
          isDisabled={inputDisabled}
          isPrimaryStyle={editToggle}
        />

        <div className='account-section-2-btns'>

          <button className='text-btn'><span>Change Password?</span></button>

          {editToggle ? (
            <Button children='Save' onClick={handleSaveClick} isPrimaryStyle={false} />
          ) : (
            <Button children='Edit' onClick={handleEditClick} isPrimaryStyle={false} />
          )}

        </div>

        {errorVisible && <h4 className='error-message'>{error}</h4>}

      </div>
    </div>
  );
}
