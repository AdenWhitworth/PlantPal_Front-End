import React from 'react';
import './AuthSelection.css';

interface AuthSelectionProps {
    isLoginSelected: boolean;
    setIsLoginSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AuthSelection({ 
    isLoginSelected,
    setIsLoginSelected,
}: AuthSelectionProps) { 

    return (
        <div className="userAuth-section-1">
            <div className="userAuth-selection">

                <button 
                    onClick={() => setIsLoginSelected(true)} 
                    className={isLoginSelected ? 'userAuth-toggle-btn-selected' : 'userAuth-toggle-btn'}
                >
                    <span>Login</span>
                </button>

                <button 
                    onClick={() => setIsLoginSelected(false)} 
                    className={isLoginSelected ? 'userAuth-toggle-btn' : 'userAuth-toggle-btn-selected'}
                >
                    <span>Sign Up</span>
                </button>

            </div>
        </div>
    );
}
