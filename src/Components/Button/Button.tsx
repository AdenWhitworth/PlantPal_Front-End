import React, { ReactNode, MouseEventHandler } from 'react';
import './Button.css';

interface ButtonProps {
    children: ReactNode;
    styleType: 'primary' | 'secondary' | 'tertiary';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset'; 
    className?: string;
    disabled?: boolean;
    testId?: string;
}

export default function Button({ 
    children, 
    styleType, 
    onClick, 
    type = 'button', 
    className = '', 
    disabled = false,
    testId,
}: ButtonProps) {

    const classType = { 
        primary: "button-hollow grow", 
        secondary: "button-fill grow",
        tertiary: "text-btn",
    };

    const combinedClassName = `${classType[styleType]}${className ? ` ${className}` : ''}`;

    return (
        <button 
            className={combinedClassName} 
            onClick={onClick} 
            type={type}
            data-testid={testId} 
            disabled={disabled}>
            {styleType === 'tertiary' ? (
                <span className="tertiary-button-text">{children}</span>
            ) : (
                children
            )}
        </button>
    );
}
