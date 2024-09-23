import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddDeviceModal from './AddDeviceModal';
import { useDevice } from '../../Provider/DeviceProvider/DeviceProvider';

jest.mock('../../Provider/DeviceProvider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        device: null,
    })),
}));

describe('AddDeviceModal', () => {
  const setConnectDeviceToggleMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when device is present and connected', () => {
    (useDevice as jest.Mock).mockReturnValue({
      device: {
        cat_num: '12345',
        presence_connection: true,
      },
    });

    render(<AddDeviceModal setConnectDeviceToggle={setConnectDeviceToggleMock} />);

    expect(screen.getByText('Successfully to 12345')).toBeInTheDocument();
    expect(screen.queryByText('Connecting to 12345...')).not.toBeInTheDocument();
    expect(screen.getByAltText('Plus Icon')).toBeInTheDocument();
    expect(screen.queryByText('Press the network button on the device to connect. Led on device will turn green when successful.')).not.toBeInTheDocument();
  });

  it('should render correctly when device is present but not connected', () => {
    (useDevice as jest.Mock).mockReturnValue({
      device: {
        cat_num: '12345',
        presence_connection: false,
      },
    });

    render(<AddDeviceModal setConnectDeviceToggle={setConnectDeviceToggleMock} />);

    expect(screen.queryByText('Successfully to 12345')).not.toBeInTheDocument();
    expect(screen.getByText('Connecting to 12345...')).toBeInTheDocument();
    expect(screen.queryByAltText('Plus Icon')).not.toBeInTheDocument();
    expect(screen.getByText('Press the network button on the device to connect. Led on device will turn green when successful.')).toBeInTheDocument();
    expect(screen.getByAltText('Time Icon')).toBeInTheDocument();
  });

  it('should call setConnectDeviceToggle with false when close button is clicked', () => {
    (useDevice as jest.Mock).mockReturnValue({ device: null });

    render(<AddDeviceModal setConnectDeviceToggle={setConnectDeviceToggleMock} />);

    fireEvent.click(screen.getByAltText('Close Icon'));
    expect(setConnectDeviceToggleMock).toHaveBeenCalledWith(false);
  });

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
