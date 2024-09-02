import React from 'react';
import Button from "../../Components/Button";
import house_plant from "../../Images/house-plant.png";

export default function LandingCallToAction({
    HandleManageDevicesClick
}) {
    
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