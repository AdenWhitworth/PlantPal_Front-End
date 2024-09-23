import React from 'react';
import plantpal_logo from "../../../Images/PlantPal Logo.svg";
import shopping_cart from "../../../Images/shopping-grey.svg";
import user from "../../../Images/user-grey.svg";
import './LandingHeader.css';
import { LandingHeaderProps, Link } from './LandingHeaderTypes';

/**
 * DashboardHeader component that renders the header section of the dashboard.
 *
 * @component
 * @param {LandingHeaderProps} props - The props for the component.
 * @returns {JSX.Element} The rendered header component.
 */
export default function DashboardHeader({
    HandleManageDevicesClick
}: LandingHeaderProps): JSX.Element {
    
    const links: Link[] = [
        { key: 1, alt: "Shopping cart logo", imgSrc: shopping_cart, onClick: () => console.log("clicked"), className: "shopping_cart" },
        { key: 2, alt: "User logo", imgSrc: user, onClick: HandleManageDevicesClick, className: "user" },
    ];

    return (
        <header className="header">
            <div className="nav-img">
                <img className="PlantPal-logo-img" src={plantpal_logo} alt="PlantPal main logo"></img>
                <h1 className="PlantPal-logo-txt">PlantPal</h1>
            </div>
            <nav className="nav-links">
                {links.map(({ key, alt, imgSrc, onClick, className }) => (
                    <li key={key}>
                        <img className={`${className} grow`} src={imgSrc} alt={alt} onClick={onClick} />
                    </li>
                ))}
            </nav>
        </header>
    );
}