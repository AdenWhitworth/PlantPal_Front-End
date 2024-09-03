import React from 'react';
import x_circle from '../Images/x-circle-black.svg';
import Button from './Button';

interface BaseModalProps { 
    children?: React.ReactNode;
    
}

interface ModalWithButtonProps extends BaseModalProps {
    addButton: true;
    handleButtonClick: () => void;
    buttonLabel: string;
    styleType: 'primary' | 'secondary' | 'tertiary';
}

interface ModalWithoutButtonProps extends BaseModalProps {
    addButton?: false;
    handleButtonClick?: never;
    buttonLabel: never;
    styleType: never;
}

interface ModalWithCloseProps extends BaseModalProps {
    addClose: true;
    handleCloseClick: () => void;
}

interface ModalWithoutCloseProps extends BaseModalProps {
    addClose?: false;
    handleCloseClick?: never;
}

type ModalProps =
    | (ModalWithButtonProps & ModalWithCloseProps) // Both button and close
    | (ModalWithButtonProps & ModalWithoutCloseProps) // Button but no close
    | (ModalWithoutButtonProps & ModalWithCloseProps) // Close but no button
    | (ModalWithoutButtonProps & ModalWithoutCloseProps); // Neither

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
