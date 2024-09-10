import React from 'react';
import './LandingCard.css';

interface LandingCardProps {
    cardImg: string;
    cardTitle: string;
    cardText: string;
}

export default function LandingCard ({
    cardImg,
    cardTitle,
    cardText,
}: LandingCardProps) {
    return(
        <div className="landing-card">
            <div className="landing-card-img">
                <img src={cardImg} alt="Card icon"></img>
            </div>
            
            <div className="landing-card-txt">
                <h3>{cardTitle}</h3>
                <p>{cardText}</p>
            </div>
        </div>
    );
}