import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DashboardHeader from './DashboardHeader';
import { useDevice } from '../../../Provider/DeviceProvider/DeviceProvider';


// Mocking the DeviceProvider
jest.mock('../../../Provider/DeviceProvider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        refreshDate: null,
    })),
}));

/**
 * Test suite for the DashboardHeader component.
 */
describe('DashboardHeader component', () => {
    const mockHandlePlantPalClick = jest.fn();
    const mockHandleRefreshClick = jest.fn();
    const mockHandleLogout = jest.fn();
    const mockShowAccountView = jest.fn();

    const defaultProps = {
        handlePlantPalClick: mockHandlePlantPalClick,
        handleRefreshClick: mockHandleRefreshClick,
        handleLogout: mockHandleLogout,
        showAccountView: mockShowAccountView,
        isSettingsVisible: false,
        isDevicesLoading: false,
        isDevicesLoaded: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (useDevice as jest.Mock).mockReturnValue({
            refreshDate: '2024-09-10 10:00',
        });
    });

    /**
     * Tests that the PlantPal logo is rendered and clickable.
     */
    it('renders the PlantPal logo and allows clicking', () => {
        render(<DashboardHeader {...defaultProps} />);

        const logo = screen.getByAltText('PlantPal main logo');
        expect(logo).toBeInTheDocument();

        fireEvent.click(logo);
        expect(mockHandlePlantPalClick).toHaveBeenCalled();
    });

    /**
     * Tests that the refresh button is rendered with the default state.
     */
    it('renders refresh button with default state', () => {
        render(<DashboardHeader {...defaultProps} isDevicesLoading={false} isDevicesLoaded={false} />);
        const refreshIcon = screen.getByAltText('Refresh logo');
        expect(refreshIcon).toHaveClass('refresh grow');
    });

    /**
     * Tests that the refresh button's class changes based on loading and loaded states.
     */
    it('renders refresh button with correct state based on loading and loaded states', () => {
        const { rerender } = render(<DashboardHeader {...defaultProps} isDevicesLoading={true} />);

        let refreshIcon = screen.getByAltText('Refresh logo');
        expect(refreshIcon).toBeInTheDocument();
        expect(refreshIcon).toHaveClass('loading');

        rerender(<DashboardHeader {...defaultProps} isDevicesLoading={false} isDevicesLoaded={true} />);
        refreshIcon = screen.getByAltText('Refresh logo');
        expect(refreshIcon).toHaveClass('loaded');
    });

    /**
     * Tests that handleRefreshClick is called when the refresh icon is clicked.
     */
    it('calls handleRefreshClick when refresh icon is clicked', () => {
        render(<DashboardHeader {...defaultProps} />);

        const refreshIcon = screen.getByAltText('Refresh logo');
        fireEvent.click(refreshIcon);
        expect(mockHandleRefreshClick).toHaveBeenCalled();
    });

    /**
     * Tests that the refresh button and last refresh date are hidden when settings view is visible.
     */
    it('hides refresh button and last refresh date when isSettingsVisible is true', () => {
        render(<DashboardHeader {...defaultProps} isSettingsVisible={true} />);

        expect(screen.queryByAltText('Refresh logo')).not.toBeInTheDocument();
        expect(screen.queryByText('2024-09-10 10:00')).not.toBeInTheDocument();
    });

    /**
     * Tests that the last refresh date is displayed when settings view is not visible.
     */
    it('shows last refresh date when isSettingsVisible is false', () => {
        render(<DashboardHeader {...defaultProps} isSettingsVisible={false} />);

        const lastRefreshDate = screen.getByText('2024-09-10 10:00');
        expect(lastRefreshDate).toBeInTheDocument();
    });

    /**
     * Tests that handleLogout is called when the logout icon is clicked.
     */
    it('calls handleLogout when logout icon is clicked', () => {
        render(<DashboardHeader {...defaultProps} />);

        const logoutIcon = screen.getByAltText('Logout logo');
        fireEvent.click(logoutIcon);
        expect(mockHandleLogout).toHaveBeenCalled();
    });

    /**
     * Tests that showAccountView is called when the gear icon is clicked.
     */
    it('calls showAccountView when gear icon is clicked', () => {
        render(<DashboardHeader {...defaultProps} />);

        const gearIcon = screen.getByAltText('Settings logo');
        fireEvent.click(gearIcon);
        expect(mockShowAccountView).toHaveBeenCalled();
    });
});
