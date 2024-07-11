import PropTypes from 'prop-types';
import React from 'react';

const InputField = ({onChange, isRequired, type, placeholder,inputImg, isSpellCheck, setWidth, setMarginTop, isDisabled, isPrimaryStyle}) => {
    
    const additionalStyle = { 
        width: setWidth,
        marginTop: setMarginTop,
    };

    const classType = { primary: "inputField", secondary: "inputField-locked"};

    return (

        <div className={isPrimaryStyle? classType.primary : classType.secondary} style={additionalStyle}>
            <input onChange={onChange} required={isRequired} disabled={isDisabled} spellCheck={isSpellCheck} type={type} placeholder={placeholder} ></input>
            <img className="inputField-img" src={inputImg} alt='Input icon'></img>
        </div>
    );
};

InputField.propTypes = {

    onChange: PropTypes.func,
    isRequired: PropTypes.bool.isRequired,
    isSpellCheck: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    inputImg: PropTypes.string,
    setWidth: PropTypes.string,
    setMarginTop: PropTypes.string,
    isPrimaryStyle: PropTypes.bool,
};

InputField.defaultProps = {
    setWidth: '100%',
    setMarginTop: '2%',
    isPrimaryStyle: true
}

export default InputField;