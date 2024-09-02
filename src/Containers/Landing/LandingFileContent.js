import React from 'react';
import calendar from "../../Images/calendar-green.svg";
import shower from "../../Images/shower-green.svg";
import LandingFileTab from './LandingFileTab';
import LandingCard from './LandingCard';

export default function LandingFileContent() {

    const cards = [
        { 
            cardImg: calendar, 
            cardTitle: "Forget the calendar", 
            cardText:"Learn exactly when your plant needs to be watered again. No need to remember when you did it last." 
        },
        {
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

                    {cards.map(({ cardImg, cardTitle, cardText}) => (
                        <LandingCard
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