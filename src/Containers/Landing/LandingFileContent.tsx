import React from 'react';
import calendar from "../../Images/calendar-green.svg";
import shower from "../../Images/shower-green.svg";
import LandingFileTab from './LandingFileTab';
import LandingCard from './LandingCard';

interface Card {
    key: number;
    cardImg: string;
    cardTitle: string;
    cardText: string;
}

export default function LandingFileContent() {

    const cards: Card[] = [
        {   
            key: 1,
            cardImg: calendar, 
            cardTitle: "Forget the calendar", 
            cardText:"Learn exactly when your plant needs to be watered again. No need to remember when you did it last." 
        },
        {   
            key: 2,
            cardImg: shower,
            cardTitle: "Travel more often",
            cardText: "Monitor you plants while on the go. Allow PlantPal to automatically water your plants when they need it.",
        }
    ];
    
    return (
        <section className="landing-body-2">
            
            <LandingFileTab></LandingFileTab>
            
            <div className="file-box">
                <div className="landing-card-sections">

                    {cards.map(({ key, cardImg, cardTitle, cardText}) => (
                        <LandingCard
                            key={key}
                            cardImg={cardImg}
                            cardTitle={cardTitle}
                            cardText={cardText}
                        ></LandingCard>
                    ))}
                   
                </div>
            </div>
        </section>
    );
}