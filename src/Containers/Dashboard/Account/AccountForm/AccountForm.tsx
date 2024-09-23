import Button from '../../../../Components/Button/Button';
import InputField from '../../../../Components/InputField/InputField';
import mail from '../../../../Images/email-brown.svg';
import x_circle from '../../../../Images/x-circle-black.svg';
import user_circle from '../../../../Images/user-circle-brown.svg';
import tag from '../../../../Images/tag-brown.svg';
import gear from '../../../../Images/gear-grey.svg';
import React from 'react';
import { useAuth } from '../../../../Provider/AuthProvider/AuthProvider';
import './AccountForm.css';
import { AccountFormProps } from './AccountFormTypes';

/**
 * AccountForm component for managing user account information.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.handleReturnForgotPassword - Function to navigate to the forgot password screen.
 * @param {Function} props.handleInputChange - Function to handle changes in input fields.
 * @param {string|null} props.error - Error message to display, or null if there are no errors.
 * @param {Function} props.handleSaveClick - Function to handle saving account changes.
 * @param {Function} props.handleEditClick - Function to toggle edit mode.
 * @param {boolean} props.editToggle - Indicates if the form is in edit mode.
 * @param {boolean} props.inputDisabled - Indicates if the input fields should be disabled.
 * @param {Function} props.handleCloseClick - Function to close the account form.
 * 
 * @returns {JSX.Element} The rendered AccountForm component.
 */
export default function AccountForm({ 
    handleSaveClick, 
    handleReturnForgotPassword,
    handleInputChange,
    error,
    handleEditClick,
    editToggle,
    inputDisabled,
    handleCloseClick,
}: AccountFormProps): JSX.Element {

    const { user } = useAuth();

    return (
        <form className="account-section-2" onSubmit={handleSaveClick} data-testid="account-form">
        
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
                onChange={handleInputChange}
                inputImg={user_circle}
                isRequired={true}
                type='text'
                name='firstName'
                placeholder={editToggle || !user ? "First Name" : user.first_name}
                isSpellCheck={false}
                setWidth={'60%'}
                isDisabled={inputDisabled}
                isPrimaryStyle={editToggle}
            />
    
            <InputField
                onChange={handleInputChange}
                inputImg={tag}
                isRequired={true}
                type='text'
                name='lastName'
                placeholder={editToggle || !user ? "Last Name" : user.last_name}
                isSpellCheck={false}
                setWidth={'60%'}
                isDisabled={inputDisabled}
                isPrimaryStyle={editToggle}
            />
    
            <InputField
                onChange={handleInputChange}
                inputImg={mail}
                isRequired={true}
                type='email'
                name='email'
                placeholder={editToggle || !user ? "Email" : user.email}
                isSpellCheck={false}
                setWidth={'60%'}
                isDisabled={inputDisabled}
                isPrimaryStyle={editToggle}
            />
    
            <div className='account-section-2-btns'>
    
                <Button styleType='tertiary' onClick={handleReturnForgotPassword} testId='change-password-btn'>Change Password?</Button>
    
                {editToggle ? (
                    <Button type="submit" styleType='secondary'>Save</Button>
                ) : (
                    <Button onClick={handleEditClick} styleType='secondary'>Edit</Button>
                )}
    
            </div>
    
            {error && <div className="error-message">{error}</div>}

        </form>
    );
}