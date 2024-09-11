import React from 'react';
import './InputField.css';

interface InputFieldProps {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void, 
    isRequired: boolean, 
    type: string, 
    placeholder: string,
    inputImg?: string, 
    isSpellCheck: boolean, 
    setWidth?: string, 
    setMarginTop?: string, 
    isDisabled?: boolean, 
    isPrimaryStyle?: boolean, 
    value?: string, 
    name?: string
}

export default function InputField ({
    onChange, 
    isRequired, 
    type, 
    placeholder,
    inputImg, 
    isSpellCheck, 
    setWidth = '100%', 
    setMarginTop = '2%', 
    isDisabled, 
    isPrimaryStyle = true, 
    value, 
    name
}:InputFieldProps) {
    
    const additionalStyle = { 
        width: setWidth,
        marginTop: setMarginTop,
    };

    const classType = { primary: "inputField", secondary: "inputField-locked"};

    return (

        <div className={isPrimaryStyle? classType.primary : classType.secondary} style={additionalStyle}>
            <input 
                onChange={onChange} 
                required={isRequired} 
                disabled={isDisabled} 
                spellCheck={isSpellCheck} 
                type={type} 
                placeholder={placeholder} 
                value={value} 
                name={name}>
            </input>
            <img className="inputField-img" src={inputImg} alt='Input icon'></img>
        </div>
    );
};