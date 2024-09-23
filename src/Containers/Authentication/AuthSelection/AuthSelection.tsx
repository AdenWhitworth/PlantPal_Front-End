import React from 'react';
import './AuthSelection.css';
import { AuthSelectionProps } from './AuthSelectionTypes';

/**
 * Component for rendering the authentication selection buttons for Login and Sign Up.
 * Allows the user to toggle between the login and sign-up forms.
 * 
 * @param {AuthSelectionProps} props - The properties for the component.
 * @returns {JSX.Element} - A JSX element containing the Login and Sign Up buttons.
 */
export default function AuthSelection({ 
    isLoginSelected,
    setIsLoginSelected,
}: AuthSelectionProps) { 

    return (
        <div className="userAuth-section-1">
            <div className="userAuth-selection">

                <button
                    data-testid="login-selection" 
                    onClick={() => setIsLoginSelected(true)} 
                    className={isLoginSelected ? 'userAuth-toggle-btn-selected' : 'userAuth-toggle-btn'}
                >
                    <span>Login</span>
                </button>

                <button
                    data-testid="signup-selection"  
                    onClick={() => setIsLoginSelected(false)} 
                    className={isLoginSelected ? 'userAuth-toggle-btn' : 'userAuth-toggle-btn-selected'}
                >
                    <span>Sign Up</span>
                </button>

            </div>
        </div>
    );
}
