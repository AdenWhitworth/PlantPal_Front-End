import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LandingHeader from './LandingHeader';
import plantpal_logo from "../../Images/PlantPal Logo.svg";
import shopping_cart from "../../Images/shopping-grey.svg";
import user from "../../Images/user-grey.svg";

describe('LandingHeader Component', () => {
    const mockHandleManageDevicesClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the PlantPal logo and navigation images', () => {
        render(<LandingHeader HandleManageDevicesClick={mockHandleManageDevicesClick} />);
        
        const plantPalLogo = screen.getByAltText('PlantPal main logo');
        expect(plantPalLogo).toBeInTheDocument();
        expect(plantPalLogo).toHaveAttribute('src', plantpal_logo);
        
        const shoppingCart = screen.getByAltText('Shopping cart logo');
        expect(shoppingCart).toBeInTheDocument();
        expect(shoppingCart).toHaveAttribute('src', shopping_cart);

        const userIcon = screen.getByAltText('User logo');
        expect(userIcon).toBeInTheDocument();
        expect(userIcon).toHaveAttribute('src', user);
    });

    test('calls HandleManageDevicesClick when the user icon is clicked', () => {
        render(<LandingHeader HandleManageDevicesClick={mockHandleManageDevicesClick} />);

        const userIcon = screen.getByAltText('User logo');
        fireEvent.click(userIcon);

        expect(mockHandleManageDevicesClick).toHaveBeenCalledTimes(1);
    });
});
