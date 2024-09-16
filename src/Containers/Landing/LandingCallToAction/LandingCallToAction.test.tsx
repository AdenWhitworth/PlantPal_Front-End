import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LandingCallToAction from './LandingCallToAction';
import house_plant from '../../Images/house-plant.png';

describe('LandingCallToAction Component', () => {
    const mockHandleManageDevicesClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all elements correctly', () => {
        render(<LandingCallToAction HandleManageDevicesClick={mockHandleManageDevicesClick} />);

        expect(screen.getByText('Never lose another house plant')).toBeInTheDocument();
        expect(screen.getByText(/Can’t remember when you last watered your plant/i)).toBeInTheDocument();

        const shopButton = screen.getByText('Shop');
        expect(shopButton).toBeInTheDocument();

        const manageButton = screen.getByText('Manage');
        expect(manageButton).toBeInTheDocument();

        const housePlantImage = screen.getByAltText('Stand alone house plant');
        expect(housePlantImage).toBeInTheDocument();
        expect(housePlantImage).toHaveAttribute('src', house_plant);
    });

    test('calls HandleManageDevicesClick when the "Manage" button is clicked', () => {
        render(<LandingCallToAction HandleManageDevicesClick={mockHandleManageDevicesClick} />);

        const manageButton = screen.getByText('Manage');
        fireEvent.click(manageButton);
        expect(mockHandleManageDevicesClick).toHaveBeenCalledTimes(1);
    });
});