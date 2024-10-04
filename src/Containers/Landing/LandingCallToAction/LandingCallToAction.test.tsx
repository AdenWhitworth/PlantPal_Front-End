import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LandingCallToAction from './LandingCallToAction';
import house_plant from '../../Images/house-plant.png';

/**
 * Tests for the LandingCallToAction component.
 */
describe('LandingCallToAction Component', () => {
    const mockHandleManageDevicesClick = jest.fn();
    const mockHandleShopClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test that all elements are rendered correctly in the LandingCallToAction component.
     */
    test('renders all elements correctly', () => {
        render(<LandingCallToAction 
            HandleManageDevicesClick={mockHandleManageDevicesClick} 
            HandleShopClick={mockHandleShopClick}
        />);

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

    /**
     * Test that the HandleManageDevicesClick function is called when the "Manage" button is clicked.
     */
    test('calls HandleManageDevicesClick when the "Manage" button is clicked', () => {
        render(<LandingCallToAction 
            HandleManageDevicesClick={mockHandleManageDevicesClick} 
            HandleShopClick={mockHandleShopClick}
        />);

        const manageButton = screen.getByText('Manage');
        fireEvent.click(manageButton);
        expect(mockHandleManageDevicesClick).toHaveBeenCalledTimes(1);
    });

    /**
     * Test that the HandleShopClick function is called when the "Shop" button is clicked.
     */
    test('calls HandleManageDevicesClick when the "Manage" button is clicked', () => {
        render(<LandingCallToAction 
            HandleManageDevicesClick={mockHandleManageDevicesClick} 
            HandleShopClick={mockHandleShopClick}
        />);

        const shopButton = screen.getByText('Shop');
        fireEvent.click(shopButton);
        expect(mockHandleShopClick).toHaveBeenCalledTimes(1);
    });
});
