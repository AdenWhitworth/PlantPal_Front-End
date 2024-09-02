import React from 'react';

export default function AuthSelection({ 
    setIsLoginSelected,
    isLoginSelected 
}) { 

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
