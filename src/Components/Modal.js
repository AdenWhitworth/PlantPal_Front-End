import React from 'react';
import x_circle from '../Images/x-circle-black.svg';
import Button from './Button';
import PropTypes from 'prop-types';

export default function Modal({handleCloseClick, handleButtonClick, children, addClose, addButton, buttonLabel, isButtonPrimary}) {

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
                        <Button children={buttonLabel} isPrimaryStyle={isButtonPrimary} onClick={handleButtonClick}></Button>
                    </div>
                    :
                    <></>
                }
            </div>
        </div>
    );
}

Modal.propTypes = {

    handleCloseClick: PropTypes.func,
    handleButtonClick: PropTypes.func,
    children: PropTypes.isRequired,
    addClose: PropTypes.bool.isRequired,
    addButton: PropTypes.bool.isRequired,
    buttonLabel: PropTypes.string,
    isButtonPrimary: PropTypes.bool,

};
