import React from 'react';
import { render, screen } from '@testing-library/react';
import PerformanceView from './PerformanceView';

//Mocking the MoistureLevel
jest.mock('./MoistureLevel/MoistureLevel', () => () => <div>Moisture Level Component</div>);

//Mocking the WifiConnection
jest.mock('./WifiConnection/WifiConnection', () => (props: any) => (
    <div>
        Wifi Connection Component
        <button onClick={props.handleRefreshClick}>Refresh</button>
    </div>
));

//Mocking the WaterStatus
jest.mock('./WaterStatus/WaterStatus', () => () => <div>Water Status Component</div>);

//Mocking the AutoManualWater
jest.mock('./AutoManualWater/AutoManualWater', () => (props: any) => (
    <div>
        AutoManualWater Component
        <button onClick={() => props.setAutoSwitch(true)}>Set Auto</button>
    </div>
));

/**
 * Test suite for the PerformanceView component.
 */
describe('PerformanceView Component', () => {
    const mockSetConnectDeviceToggle = jest.fn();
    const mockHandleRefreshClick = jest.fn();
    const mockSetAutoSwitch = jest.fn();
    const mockSetConfirmAuto = jest.fn();

    const defaultProps = {
        handleRefreshClick: mockHandleRefreshClick,
        setConnectDeviceToggle: mockSetConnectDeviceToggle,
        autoSwitch: false,
        setAutoSwitch: mockSetAutoSwitch,
        setConfirmAuto: mockSetConfirmAuto
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test to verify that the PerformanceView component renders all its child components.
     */
    test('renders all child components', () => {
        render(<PerformanceView {...defaultProps} />);

        expect(screen.getByText('Moisture Level Component')).toBeInTheDocument();
        expect(screen.getByText('Wifi Connection Component')).toBeInTheDocument();
        expect(screen.getByText('Water Status Component')).toBeInTheDocument();
        expect(screen.getByText('AutoManualWater Component')).toBeInTheDocument();
    });

    /**
     * Test to verify that the correct props are passed to the WifiConnection component
     * and that the handleRefreshClick function is called when the refresh button is clicked.
     */
    test('passes correct props to WifiConnection component', () => {
        render(<PerformanceView {...defaultProps} />);

        const refreshButton = screen.getByText('Refresh');
        refreshButton.click();

        expect(mockHandleRefreshClick).toHaveBeenCalled();
    });

    /**
     * Test to verify that the correct props are passed to the AutoManualWater component
     * and that the setAutoSwitch function is called with the correct value.
     */
    test('passes correct props to AutoManualWater component and interacts with setAutoSwitch', () => {
        render(<PerformanceView {...defaultProps} />);

        const setAutoButton = screen.getByText('Set Auto');
        setAutoButton.click();

        expect(mockSetAutoSwitch).toHaveBeenCalledWith(true);
    });
});
