import React from 'react';
import LandingHeader from "./LandingHeader/LandingHeader";
import LandingCallToAction from './LandingCallToAction/LandingCallToAction';
import LandingFileContent from './LandingFileContent/LandingFileContent';
import { useNavigate } from "react-router-dom";
import './Landing.css';

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

    return (
        <section className="landing">
            
            <LandingHeader
                HandleManageDevicesClick={HandleManageDevicesClick}
            ></LandingHeader>

            <LandingCallToAction
                HandleManageDevicesClick={HandleManageDevicesClick}
            ></LandingCallToAction>

            <LandingFileContent></LandingFileContent>

        </section>
    );
}