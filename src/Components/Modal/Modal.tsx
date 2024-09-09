import React from 'react';
import x_circle from '../../Images/x-circle-black.svg';
import Button from '../Button/Button';
import './Modal.css';

interface ModalProps { 
    children?: React.ReactNode;
    addButton: boolean;
    handleButtonClick?: () => void;
    buttonLabel: string;
    styleType: 'primary' | 'secondary' | 'tertiary';
    addClose: boolean;
    handleCloseClick?: () => void;
}

export default function Modal({
    handleCloseClick, 
    handleButtonClick, 
    children, 
    addClose = false, 
    addButton = false, 
    buttonLabel = '', 
    styleType = 'primary'
}: ModalProps) {

    return (
        <div className="modal">
            <div className='modal-content'>
                
                {addClose?
                    <div className='modal-close'>
                        <img className='grow' src={x_circle} alt='Close Icon' onClick={handleCloseClick}></img>
                    </div>
                    :
                    <></>
                }

                {children}
                
                {addButton?

                    <div className='modal-btns'>
                        <Button styleType={styleType} onClick={handleButtonClick}>{buttonLabel}</Button>
                    </div>
                    :
                    <></>
                }
            </div>
        </div>
    );
}
