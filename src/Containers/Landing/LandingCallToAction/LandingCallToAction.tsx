import React from 'react';
import Button from "../../../Components/Button/Button";
import house_plant from "../../../Images/house-plant.png";
import './LandingCallToAction.css';
import { LandingCallToActionProps } from './LandingCallToActionTypes';

/**
 * LandingCallToAction component for displaying a call to action on the landing page.
 *
 * @component
 * @param {LandingCallToActionProps} props - The properties for the LandingCallToAction component.
 * @returns {JSX.Element} The rendered LandingCallToAction component.
 */
export default function LandingCallToAction({
    HandleManageDevicesClick
}:LandingCallToActionProps): JSX.Element {
    
    return (
        <section className="landing-body-1">
            <div className="landing-body-1-section">
                <div className="landing-body-1-content">
                    <h1>Never lose another house plant</h1>
                    <p>Can’t remember when you last watered your plant? Going out of town and don’t want your plant to die? </p>

                    <div className="landing-body-1-btns">
                        <Button styleType='primary' >Shop</Button>
                        <Button styleType='secondary' onClick={HandleManageDevicesClick}>Manage</Button>
                    </div>
                </div>

                <div className="landing-body-1-img">
                    <img className="house-plant" src={house_plant} alt="Stand alone house plant"></img>
                </div>
            </div>
        </section>
    );
}