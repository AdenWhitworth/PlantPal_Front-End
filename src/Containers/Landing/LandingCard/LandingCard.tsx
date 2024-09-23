import React from 'react';
import './LandingCard.css';
import { LandingCardProps } from './LandingCardTypes';

/**
 * Represents a card component for the landing page.
 *
 * @component
 * @param {LandingCardProps} props - The properties for the landing card.
 * @returns {JSX.Element} The rendered landing card component.
 */
export default function LandingCard ({
    cardImg,
    cardTitle,
    cardText,
}: LandingCardProps): JSX.Element {
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