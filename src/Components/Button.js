import PropTypes from 'prop-types';
import React from 'react';

export default function Button ({ children, isPrimaryStyle, onClick, type }) {
    
    const classType = { primary: "button-hollow grow", secondary: "button-fill grow"};
    
    return (
        <button className={isPrimaryStyle? classType.primary : classType.secondary} onClick={onClick} type={type}>
            {children}
        </button>
    );
};


Button.propTypes = {
    children: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isPrimary: PropTypes.bool.isRequired,
    type: PropTypes.string,
};
