import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingCard from './LandingCard';

describe('LandingCard Component', () => {
    const mockProps = {
        cardImg: 'test-image.png',
        cardTitle: 'Test Title',
        cardText: 'Test card description.',
    };

    test('renders all elements correctly', () => {
        render(<LandingCard {...mockProps} />);

        const cardImage = screen.getByAltText('Card icon');
        expect(cardImage).toBeInTheDocument();
        expect(cardImage).toHaveAttribute('src', mockProps.cardImg);

        const cardTitle = screen.getByText(mockProps.cardTitle);
        expect(cardTitle).toBeInTheDocument();

        const cardText = screen.getByText(mockProps.cardText);
        expect(cardText).toBeInTheDocument();
    });
});