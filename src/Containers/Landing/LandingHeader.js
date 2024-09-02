import React from 'react';
import plantpal_logo from "../../Images/PlantPal Logo.svg";
import shopping_cart from "../../Images/shopping-grey.svg";
import user from "../../Images/user-grey.svg";

export default function DashboardHeader({
    HandleManageDevicesClick
}) {
    
    const links = [
        { alt: "Shopping cart logo", imgSrc: shopping_cart, onclick: () => console.log("clicked"), className: "shopping_cart" },
        { alt: "User logo", imgSrc: user, onClick: HandleManageDevicesClick, className: "user" },
    ];

    return (
        <header className="header">
            <div className="nav-img">
                <img className="PlantPal-logo-img" src={plantpal_logo} alt="PlantPal main logo"></img>
                <h1 className="PlantPal-logo-txt">PlantPal</h1>
            </div>
            <nav className="nav-links">
                {links.map(({ alt, imgSrc, onClick, className }) => (
                    <li key={alt}>
                        <img className={`${className} grow`} src={imgSrc} alt={alt} onClick={onClick} />
                    </li>
                ))}
            </nav>
        </header>
    );
}