import plantpal_logo from "../Images/PlantPal Logo.svg";
import shopping_cart from "../Images/shopping-grey.svg";
import user from "../Images/user-grey.svg";
import house_plant from "../Images/house-plant.png";
import calendar from "../Images/calendar-green.svg";
import shower from "../Images/shower-green.svg";
import React, {  } from 'react';

export default function Landing({setManageDevices}) {

    const HandleManageDevicesToggle = () => {
        setManageDevices(true);
    }

    return (
        <section className="landing">
            
            <div className="header">
                <div className="nav-img">
                    <img className="PlantPal-logo-img" src={plantpal_logo} alt="PlantPal main logo"></img>
                    <h1 className="PlantPal-logo-txt">PlantPal</h1>
                </div>
                <div className="nav-links">
                    <li><img className="shopping_cart grow" src={shopping_cart} alt="Shopping cart logo"></img></li>
                    <li><img className="user grow" src={user} alt="User logo" onClick={HandleManageDevicesToggle}></img></li>
                </div>
            </div>

            <div className="landing-body-1">

                <div className="landing-body-1-section">
                    <div className="landing-body-1-content">
                        <h1>Never lose another house plant</h1>
                        <p>Can’t remember when you last watered your plant? Going out of town and don’t want your plant to die? </p>

                        <div className="landing-body-1-btns">
                            <button className="button-hollow grow">Shop</button>
                            <button className="button-fill grow" onClick={HandleManageDevicesToggle}>Manage</button>
                        </div>
                    </div>

                    <div className="landing-body-1-img">
                        <img className="house-plant" src={house_plant} alt="Stand alone house plant"></img>
                    </div>
                </div>
                
            </div>

            <div className="landing-body-2">
                
                <div className="file-tab-container">
                    <div className="file-tab"></div>
                    <div className="file-tab-adjust">
                        <div className="file-tab-adjust-2"></div>
                    </div>
                    
                </div>
                
                <div className="file-box">
                    <div className="landing-card-sections">
                        <div className="landing-card">
                            <div className="landing-card-img">
                                <img src={calendar} alt="calendar icon"></img>
                            </div>
                            
                            <div className="landing-card-txt">
                                <h3>Forget the calendar</h3>
                                <p>Learn exactly when your plant needs to be watered again. No need to remember when you did it last.</p>
                            </div>
                        </div>
                        <div className="landing-card">
                            <div className="landing-card-img">
                                <img src={shower} alt="calendar icon"></img>
                            </div>
                            
                            <div className="landing-card-txt">
                                <h3>Travel more often</h3>
                                <p>Monitor you plants while on the go. Allow PlantPal to automatically water your plants when they need it.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </div>

        </section>
    );
}