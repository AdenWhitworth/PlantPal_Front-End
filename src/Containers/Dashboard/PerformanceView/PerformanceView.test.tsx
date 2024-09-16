import React from 'react';
import { render, screen } from '@testing-library/react';
import PerformanceView from './PerformanceView';

jest.mock('./MoistureLevel/MoistureLevel', () => () => <div>Moisture Level Component</div>);
jest.mock('./WifiConnection/WifiConnection', () => (props: any) => (
    <div>
        Wifi Connection Component
        <button onClick={props.handleRefreshClick}>Refresh</button>
    </div>
));
jest.mock('./WaterStatus/WaterStatus', () => () => <div>Water Status Component</div>);
jest.mock('./AutoManualWater/AutoManualWater', () => (props: any) => (
    <div>
        AutoManualWater Component
        <button onClick={() => props.setAutoSwitch(true)}>Set Auto</button>
    </div>
));

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

    test('renders all child components', () => {
        render(<PerformanceView {...defaultProps} />);

        expect(screen.getByText('Moisture Level Component')).toBeInTheDocument();
        expect(screen.getByText('Wifi Connection Component')).toBeInTheDocument();
        expect(screen.getByText('Water Status Component')).toBeInTheDocument();
        expect(screen.getByText('AutoManualWater Component')).toBeInTheDocument();
    });

    test('passes correct props to WifiConnection component', () => {
        render(<PerformanceView {...defaultProps} />);

        const refreshButton = screen.getByText('Refresh');
        refreshButton.click();

        expect(mockHandleRefreshClick).toHaveBeenCalled();
    });

    test('passes correct props to AutoManualWater component and interacts with setAutoSwitch', () => {
        render(<PerformanceView {...defaultProps} />);

        const setAutoButton = screen.getByText('Set Auto');
        setAutoButton.click();

        expect(mockSetAutoSwitch).toHaveBeenCalledWith(true);
    });
});
