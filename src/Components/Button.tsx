import React, { ReactNode, MouseEventHandler } from 'react';

interface ButtonProps {
    children: ReactNode;
    styleType: 'primary' | 'secondary' | 'tertiary';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset'; 
    className?: string;
    disabled?: boolean;
}

export default function Button({ 
    children, 
    styleType, 
    onClick, 
    type = 'button', 
    className = '', 
    disabled = false,
}: ButtonProps) {

    const classType = { 
        primary: "button-hollow grow", 
        secondary: "button-fill grow",
        tertiary: "text-btn"
    };

    return (
        <button 
            className={`${classType[styleType]} ${className}`} 
            onClick={onClick} 
            type={type} 
            disabled={disabled}>
            {styleType === 'tertiary' ? (
                <span>{children}</span>
            ) : (
                children
            )}
        </button>
    );
}
