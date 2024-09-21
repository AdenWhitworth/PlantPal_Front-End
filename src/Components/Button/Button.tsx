import React from 'react';
import './Button.css';
import { ButtonProps } from './ButtonTypes';

/**
 * A reusable Button component that renders a styled button with various options for
 * customization, including style type, click handling, and button type.
 *
 * @component
 * @param {ButtonProps} props - The props for the Button component.
 * @returns {JSX.Element} The rendered button element.
 */
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
