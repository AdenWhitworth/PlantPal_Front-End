import React, {useEffect, useState} from 'react';
import plantpal_logo from "../../../Images/PlantPal Logo.svg";
import gear from "../../../Images/gear-grey.svg";
import exit from "../../../Images/exit-grey.svg";
import refresh from "../../../Images/refresh-gray.svg";
import { useDevice } from '../../../Provider/DeviceProvider';
import './DashboardHeader.css';

interface DashboardHeaderProps {
    handlePlantPalClick: () => void; 
    handleRefreshClick: () => void;
    handleLogout: () => void;
    showAccountView: () => void;
    isSettingsVisible: boolean;
    isDevicesLoading: boolean;
    isDevicesLoaded: boolean;
}


export default function DashboardHeader({
    handlePlantPalClick, 
    handleRefreshClick, 
    handleLogout,
    showAccountView,
    isSettingsVisible,
    isDevicesLoading,
    isDevicesLoaded
}: DashboardHeaderProps) {
    const { refreshDate } = useDevice();
    const [refreshCSS, setRefreshCSS] = useState('refresh grow');
    

    const links = [
        { key: 1, alt: "Settings logo", imgSrc: gear, onClick: showAccountView, className: "gear" },
        { key: 2, alt: "Logout logo", imgSrc: exit, onClick: handleLogout, className: "exit" },
    ];

    useEffect(() => {
        if (isDevicesLoading){
            setRefreshCSS('refresh loading');
        }

        if (!isDevicesLoading && isDevicesLoaded){
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
                {links.map(({ key, alt, imgSrc, onClick, className }) => (
                    <li key={key}>
                        <img className={`${className} grow`} src={imgSrc} alt={alt} onClick={onClick} />
                    </li>
                ))}
            </nav>
        </header>
    );
}
