import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import DeviceItem from './DeviceItem';
import { useDevice } from '../../../../Provider/DeviceProvider/DeviceProvider';

// Mocking the DeviceProvider
jest.mock('../../../../Provider/DeviceProvider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        setDevice: jest.fn(),
        device: null,
    })),
}));

/**
 * Tests for the DeviceItem component.
 */
describe('DeviceItem component', () => {
  const mockSetDevice = jest.fn();
  const mockShowPerformanceView = jest.fn();

  const mockDevice = {
    device_id: 1,
    cat_num: '123456',
    user_id: 1,
    wifi_ssid: 'TestSSID',
    wifi_password: 'password123',
    init_vec: 'test-init-vec',
    presence_connection: true,
    location: 'Living Room',
    thing_name: 'TestDevice',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useDevice as jest.Mock).mockReturnValue({
      device: null,
      setDevice: mockSetDevice,
    });

  });

  /**
   * Test case for rendering the device information correctly.
   */
  it('renders the device information correctly', () => {
    render(
      <DeviceItem
        devices={mockDevice}
        index={0}
        connectDeviceToggle={false}
        isSettingsVisible={false}
        showPerformanceView={mockShowPerformanceView}
      />
    );

    expect(screen.getByText('Living Room - 123456')).toBeInTheDocument();
  });
  
  /**
   * Test case for handling device click and setting the device.
   */
  it('handles device click and sets the device', () => {
    render(
      <DeviceItem
        devices={mockDevice}
        index={0}
        connectDeviceToggle={false}
        isSettingsVisible={false}
        showPerformanceView={mockShowPerformanceView}
      />
    );

    fireEvent.click(screen.getByTestId('device-btn'));

    expect(mockSetDevice).toHaveBeenCalledWith(mockDevice);
    expect(mockShowPerformanceView).not.toHaveBeenCalled();
  });

  /**
   * Test case for calling showPerformanceView if isSettingsVisible is true.
   */
  it('calls showPerformanceView if isSettingsVisible is true', () => {
    render(
      <DeviceItem
        devices={mockDevice}
        index={0}
        connectDeviceToggle={false}
        isSettingsVisible={true}
        showPerformanceView={mockShowPerformanceView}
      />
    );

    fireEvent.click(screen.getByTestId('device-btn'));

    expect(mockSetDevice).toHaveBeenCalledWith(mockDevice);
    expect(mockShowPerformanceView).toHaveBeenCalled();
  });

  /**
   * Test case for setting the selected style when the current device matches.
   */
  it('sets the selected style when the current device matches', () => {
    (useDevice as jest.Mock).mockReturnValue({
      device: mockDevice,
      setDevice: mockSetDevice,
    });

    render(
      <DeviceItem
        devices={mockDevice}
        index={0}
        connectDeviceToggle={true}
        isSettingsVisible={false}
        showPerformanceView={mockShowPerformanceView}
      />
    );

    const deviceLine = screen.getByTestId('device-btn');
    expect(deviceLine).toHaveClass('device-line selected');
  });

  /**
   * Test case for resetting the style when the device changes.
   */
  it('resets the style when the device changes', () => {
    (useDevice as jest.Mock).mockReturnValue({
      device: { ...mockDevice, cat_num: '654321' },
      setDevice: mockSetDevice,
    });

    render(
      <DeviceItem
        devices={mockDevice}
        index={0}
        connectDeviceToggle={false}
        isSettingsVisible={false}
        showPerformanceView={mockShowPerformanceView}
      />
    );

    const deviceLine = screen.getByTestId('device-btn');
    expect(deviceLine).toHaveClass('device-line');
  });

  /**
   * Test case for updating the device when the wifi_ssid or wifi_password changes.
   */
  it('updates the device when the wifi_ssid or wifi_password changes', async () => {
    (useDevice as jest.Mock).mockReturnValue({
      device: { ...mockDevice, wifi_ssid: 'OldSSID' },
      setDevice: mockSetDevice,
    });

    render(
      <DeviceItem
        devices={mockDevice}
        index={0}
        connectDeviceToggle={false}
        isSettingsVisible={false}
        showPerformanceView={mockShowPerformanceView}
      />
    );

    await waitFor(() => {
      expect(mockSetDevice).toHaveBeenCalledWith(mockDevice);
    });
  });

  /**
   * Test case for setting the device on the first index even if it is a different device.
   */
  it('sets the device on first index even if it is a different device', async () => {
    (useDevice as jest.Mock).mockReturnValue({
      device: { ...mockDevice, cat_num: '654321' },
      setDevice: mockSetDevice,
    });

    render(
      <DeviceItem
        devices={mockDevice}
        index={0}
        connectDeviceToggle={false}
        isSettingsVisible={false}
        showPerformanceView={mockShowPerformanceView}
      />
    );

    await waitFor(() => {
      expect(mockSetDevice).toHaveBeenCalledWith(mockDevice);
    });
  });
});
