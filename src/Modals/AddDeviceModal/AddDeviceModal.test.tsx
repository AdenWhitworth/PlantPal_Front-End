import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddDeviceModal from './AddDeviceModal';
import { useDevice } from '../../Provider/DeviceProvider/DeviceProvider';

//Mocking the DeviceProvider
jest.mock('../../Provider/DeviceProvider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        device: null,
    })),
}));

/**
 * Test suite for the AddDeviceModal component.
 */
describe('AddDeviceModal', () => {
  const setConnectDeviceToggleMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests rendering when the device is present and connected.
   */
  it('should render correctly when device is present and connected', () => {
    (useDevice as jest.Mock).mockReturnValue({
      device: {
        cat_num: '12345',
        presence_connection: true,
      },
    });

    render(<AddDeviceModal setConnectDeviceToggle={setConnectDeviceToggleMock} />);

    expect(screen.getByText('Successfully connected to 12345!')).toBeInTheDocument();
    expect(screen.queryByText('Connecting to 12345...')).not.toBeInTheDocument();
    expect(screen.getByAltText('Check Icon')).toBeInTheDocument();
  });

  /**
   * Tests rendering when the device is present but not connected.
   */
  it('should render correctly when device is present but not connected', () => {
    (useDevice as jest.Mock).mockReturnValue({
      device: {
        cat_num: '12345',
        presence_connection: false,
      },
    });

    render(<AddDeviceModal setConnectDeviceToggle={setConnectDeviceToggleMock} />);

    expect(screen.queryByText('Successfully connected to 12345')).not.toBeInTheDocument();
    expect(screen.getByText('Connecting to 12345...')).toBeInTheDocument();
    expect(screen.queryByAltText('Check Icon')).not.toBeInTheDocument();
    expect(screen.getByAltText('Time Icon')).toBeInTheDocument();
  });

  /**
   * Tests that the close button calls setConnectDeviceToggle with false.
   */
  it('should call setConnectDeviceToggle with false when close button is clicked', () => {
    (useDevice as jest.Mock).mockReturnValue({ device: null });

    render(<AddDeviceModal setConnectDeviceToggle={setConnectDeviceToggleMock} />);

    fireEvent.click(screen.getByAltText('Close Icon'));
    expect(setConnectDeviceToggleMock).toHaveBeenCalledWith(false);
  });

  /**
   * Tests that the continue button calls setConnectDeviceToggle with false.
   */
  it('should call setConnectDeviceToggle with false when continue button is clicked', () => {
    (useDevice as jest.Mock).mockReturnValue({
        device: {
          cat_num: '12345',
          presence_connection: true,
        },
    });

    render(<AddDeviceModal setConnectDeviceToggle={setConnectDeviceToggleMock} />);

    fireEvent.click(screen.getByText("Continue"));
    expect(setConnectDeviceToggleMock).toHaveBeenCalledWith(false);
  });
});
