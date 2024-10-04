import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from './Landing';
import { useNavigate } from 'react-router-dom';

//Mocking the react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

/**
 * Tests for the Landing component.
 */
describe('Landing Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test that the Landing component renders correctly.
     * Verifies the presence of the header, call to action, and file content.
     */
    test('should render Landing component with header, call to action, and file content', () => {
        render(
            <MemoryRouter>
                <Landing />
            </MemoryRouter>
        );

        expect(screen.getByAltText('PlantPal main logo')).toBeInTheDocument();
        expect(screen.getByText(/Manage/i)).toBeInTheDocument();
        expect(screen.getAllByAltText('Card icon').length).toBe(2);
    });

    /**
     * Test that the "Manage Devices" button navigates to the dashboard.
     * Verifies that clicking the button calls the navigation function with
     * the correct arguments.
     */
    test('should navigate to the dashboard when the "Manage Devices" button is clicked', () => {
        render(
            <MemoryRouter>
                <Landing />
            </MemoryRouter>
        );

        const manageDevicesButton = screen.getByText(/Manage/i);
        fireEvent.click(manageDevicesButton);

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });

    /**
     * Test that the "Shop" button opens the modal.
     * Verifies that clicking the "Shop" button displays the modal.
     */
    test('should display the shop modal when the "Shop" button is clicked', () => {
        render(
            <MemoryRouter>
                <Landing />
            </MemoryRouter>
        );

        const shopButton = screen.getByText(/Shop/i);
        fireEvent.click(shopButton);

        expect(screen.getByAltText("Cart Icon")).toBeInTheDocument();
        expect(screen.getByText('Stay tuned! PlantPal will be for sale soon!')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Acknowledge' })).toBeInTheDocument();
    });
    
    /**
     * Test that the modal closes when the "Acknowledge" button is clicked.
     * Verifies that clicking the "Acknowledge" button hides the modal.
     */
    test('should close the shop modal when "Acknowledge" button is clicked', () => {
        render(
            <MemoryRouter>
                <Landing />
            </MemoryRouter>
        );

        const shopButton = screen.getByText(/Shop/i);
        fireEvent.click(shopButton);

        expect(screen.getByText('Stay tuned! PlantPal will be for sale soon!')).toBeInTheDocument();

        const acknowledgeButton = screen.getByRole('button', { name: 'Acknowledge' });
        fireEvent.click(acknowledgeButton);

        expect(screen.queryByAltText("Cart Icon")).not.toBeInTheDocument();
        expect(screen.queryByText('Stay tuned! PlantPal will be for sale soon!')).not.toBeInTheDocument();
    });
});

