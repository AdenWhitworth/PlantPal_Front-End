import React from 'react';
import x_circle from '../../Images/x-circle-black.svg';
import Button from '../Button/Button';
import './Modal.css';
import { ModalProps } from './ModalTypes';

/**
 * A functional React component that renders a modal dialog.
 * 
 * The Modal can display content, an optional close icon, and an optional button.
 * It supports different button styles and handles button and close actions.
 * 
 * @component
 * @param {ModalProps} props - The props for the Modal component.
 * @returns {JSX.Element} The rendered modal component.
 * 
 * @example
 * return (
 *   <Modal
 *     addButton={true}
 *     handleButtonClick={() => alert('Button clicked!')}
 *     buttonLabel="Confirm"
 *     styleType="primary"
 *     addClose={true}
 *     handleCloseClick={() => alert('Modal closed!')}
 *   >
 *     <p>This is the modal content.</p>
 *   </Modal>
 * )
 */
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
