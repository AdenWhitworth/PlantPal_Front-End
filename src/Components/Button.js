import PropTypes from 'prop-types';
import React from 'react';

export default function Button({ children, styleType, onClick, type, className, disabled }) {

    const classType = { 
        primary: "button-hollow grow", 
        secondary: "button-fill grow",
        tertiary: "text-btn"
    };

    return (
        
        <button className={`${classType[styleType]} ${className}`} onClick={onClick} type={type} disabled={disabled}>
            {styleType === 'tertiary' ? (
                <span>{children}</span>
            ) : (
                children
            )}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    styleType: PropTypes.oneOf(['primary', 'secondary', 'tertiary']).isRequired,
    type: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};
