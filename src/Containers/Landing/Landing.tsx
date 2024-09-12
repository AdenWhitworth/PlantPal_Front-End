import React from 'react';
import LandingHeader from "./LandingHeader/LandingHeader";
import LandingCallToAction from './LandingCallToAction/LandingCallToAction';
import LandingFileContent from './LandingFileContent/LandingFileContent';
import { useNavigate } from "react-router-dom";
import './Landing.css';

export default function Landing() {

    const navigate = useNavigate();

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