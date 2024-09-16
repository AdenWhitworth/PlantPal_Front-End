import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingFileContent from './LandingFileContent';

describe('LandingFileContent Component', () => {
    test('renders LandingFileTab and LandingCard components correctly', () => {
        
        const { container } = render(<LandingFileContent />);

        const containerDiv = container.querySelector('.file-tab-container');
        expect(containerDiv).toBeInTheDocument();

        const cards = screen.getAllByAltText('Card icon');
        expect(cards).toHaveLength(2);
        const [calendarCard, showerCard] = cards;
        expect(calendarCard).toBeInTheDocument();
        expect(showerCard).toBeInTheDocument();

        expect(screen.getByText('Forget the calendar')).toBeInTheDocument();
        expect(screen.getByText('Learn exactly when your plant needs to be watered again. No need to remember when you did it last.')).toBeInTheDocument();
        expect(screen.getByText('Travel more often')).toBeInTheDocument();
        expect(screen.getByText('Monitor you plants while on the go. Allow PlantPal to automatically water your plants when they need it.')).toBeInTheDocument();
    });
});
