import React, {useEffect, useState} from 'react';
import plantpal_logo from "../../Images/PlantPal Logo.svg";
import gear from "../../Images/gear-grey.svg";
import exit from "../../Images/exit-grey.svg";
import refresh from "../../Images/refresh-gray.svg";
import { useDevice } from '../../Provider/DeviceProvider';

export default function DashboardHeader({
    handlePlantPalClick, 
    handleRefreshClick, 
    handleLogout,
    showAccountView,
    isSettingsVisible,
    isDevicesLoading
}) {
    const { refreshDate } = useDevice();
    const [isDevicesLoaded, setIsDevicesLoaded] = useState(false);
    const [refreshCSS, setRefreshCSS] = useState('refresh grow');
    

    const links = [
        { alt: "Settings logo", imgSrc: gear, onClick: showAccountView, className: "gear" },
        { alt: "Logout logo", imgSrc: exit, onClick: handleLogout, className: "exit" },
    ];

    useEffect(() => {
        if (isDevicesLoading){
            setIsDevicesLoaded(true);
            setRefreshCSS('refresh loading');
        }

        if (!isDevicesLoading && isDevicesLoaded){
            setIsDevicesLoaded(false);
            setRefreshCSS('refresh loaded');
        }

    }, [isDevicesLoading, isDevicesLoaded]);

    return (
        <header className='dashboard-header'>
            <div className="dashboard-header-logo grow" onClick={handlePlantPalClick}>
                <img src={plantpal_logo} alt="PlantPal main logo" />
                <h1>PlantPal</h1>
            </div>
            <nav className="dashboard-header-links">
                {!isSettingsVisible && (
                    <>
                        <li><h4 className="last-refresh">{refreshDate}</h4></li>
                        <li>
                            <img 
                                className={refreshCSS} 
                                src={refresh} 
                                alt="Refresh logo" 
                                onClick={handleRefreshClick} 
                            />
                        </li>
                    </>
                )}
                {links.map(({ alt, imgSrc, onClick, className }) => (
                    <li key={alt}>
                        <img className={`${className} grow`} src={imgSrc} alt={alt} onClick={onClick} />
                    </li>
                ))}
            </nav>
        </header>
    );
}

