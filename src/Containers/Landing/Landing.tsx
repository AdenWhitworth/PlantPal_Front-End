import React, { useState } from 'react';
import LandingHeader from "./LandingHeader/LandingHeader";
import LandingCallToAction from './LandingCallToAction/LandingCallToAction';
import LandingFileContent from './LandingFileContent/LandingFileContent';
import { useNavigate } from "react-router-dom";
import './Landing.css';
import Modal from '../../Components/Modal/Modal';
import cart from '../../Images/shopping-grey.svg'

/**
 * Landing component for the application.
 * 
 * This component serves as the entry point of the application, containing
 * the header, a call to action, and file content sections.
 * 
 * @component
 * @returns {JSX.Element} The rendered Landing component.
 */
export default function Landing(): JSX.Element {

    const navigate = useNavigate();
    const [shop, setShop] = useState<boolean>(false);

    /**
     * Handles the click event for managing devices.
     * Navigates to the dashboard route.
     * 
     * @function
     */
    const HandleManageDevicesClick = () => {
        navigate('/dashboard', {
            replace: true,
        });
    }

    /**
     * Handles the click event for shopping.
     * 
     * @function
     */
    const HandleShopClick = () => {
        setShop(true);
    }

    /**
     * Handles the click event for acknowledging shopping modal.
     * 
     * @function
     */
    const HandleShopAcknowledgeClick = () => {
        setShop(false);
    }

    return (
        <section className="landing">

            {shop && (
                <Modal 
                    addClose={false} 
                    addButton={true}
                    buttonLabel='Acknowledge'
                    styleType='primary'
                    children={
                        <div>
                            <div className='modal-shop'>
                                <img src={cart} alt='Cart Icon'></img>
                            </div>
                            
                            <h3>Stay tuned! PlantPal will be for sale soon!</h3>
                        </div>
                    }
                    handleButtonClick={HandleShopAcknowledgeClick}
                ></Modal>
            )}
            
            <LandingHeader
                HandleShopClick={HandleShopClick}
                HandleManageDevicesClick={HandleManageDevicesClick}
            ></LandingHeader>

            <LandingCallToAction
                HandleShopClick={HandleShopClick}
                HandleManageDevicesClick={HandleManageDevicesClick}
            ></LandingCallToAction>

            <LandingFileContent></LandingFileContent>

        </section>
    );
}