import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { DeviceProvider, useDevice } from './DeviceProvider';
import { TestDeviceComponentProps } from './DeviceProviderTypes';
import { Device, DeviceShadow, DeviceLog } from './DeviceProviderTypes';

const mockDevices: Device[] = [
  { 
    device_id: 1, 
    cat_num: "A123", 
    user_id: 1, 
    wifi_ssid: "SSID", 
    wifi_password: "PASS", 
    init_vec: "vec", 
    presence_connection: true, 
    location: "Home", 
    thing_name: "Thing1" 
  }, 
  { 
    device_id: 2, 
    cat_num: "B456", 
    user_id: 1, 
    wifi_ssid: "SSID2", 
    wifi_password: "PASS2", 
    init_vec: "vec2", 
    presence_connection: false, 
    location: "Office", 
    thing_name: "Thing2" 
  }
];

const mockShadow: DeviceShadow = { 
  state: { 
      reported: { 
          welcome: "on", 
          connected: true, 
          auto: true, 
          pump: true 
      }, desired: { 
          welcome: "off", 
          connected: false, 
          auto: false, 
          pump: false 
      } 
  }, metadata: {} 
};

const mockDeviceLogs: DeviceLog[] = [
  { 
      log_id: 1, 
      cat_num: "A123", 
      soil_temp: 25, 
      soil_cap: 50, 
      log_date: "2024-01-01", 
      water: 100 
  },
  { 
      log_id: 2, 
      cat_num: "B456", 
      soil_temp: 22, 
      soil_cap: 40, 
      log_date: "2024-01-02", 
      water: 80 
  }
]

/**
 * Tests for the DeviceProvider and its context functionality.
 */
describe('DeviceProvider', () => {
  /**
   * Test component for rendering device data within the DeviceProvider context.
   * 
   * @component
   * @param {TestDeviceComponentProps} props - The props for the component.
   * @returns {JSX.Element} The rendered component.
   */
  const TestDeviceComponent: React.FC<TestDeviceComponentProps> = ({ testSetters }: TestDeviceComponentProps): JSX.Element => {
    const {
      devices,
      setDevices,
      device,
      setDevice,
      deviceShadow,
      setDeviceShadow,
      deviceLogs,
      setDeviceLogs,
      lastLog,
      setLastLog,
      refreshDate,
      setRefreshDate,
    } = useDevice();

    if (testSetters) {
      setDevices(mockDevices);
      setDevice(mockDevices[1]);
      setDeviceShadow(mockShadow);
      setDeviceLogs(mockDeviceLogs);
      setLastLog(mockDeviceLogs[1]);
      setRefreshDate(mockDeviceLogs[1].log_date);
    }

    return (
      <div>
        <div>Devices: {JSON.stringify(devices)}</div>
        <div>Device: {JSON.stringify(device)}</div>
        <div>Device Shadow: {JSON.stringify(deviceShadow)}</div>
        <div>Device Logs: {JSON.stringify(deviceLogs)}</div>
        <div>Last Log: {JSON.stringify(lastLog)}</div>
        <div>Refresh Date: {refreshDate}</div>
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test to ensure the DeviceProvider initializes with default values.
   */
  test('initializes with default values', () => {
    render(
      <DeviceProvider>
        <TestDeviceComponent />
      </DeviceProvider>
    );

    expect(screen.getByText('Devices: []')).toBeInTheDocument();
    expect(screen.getByText('Device: null')).toBeInTheDocument();
    expect(screen.getByText('Device Shadow: null')).toBeInTheDocument();
    expect(screen.getByText('Device Logs: []')).toBeInTheDocument();
    expect(screen.getByText('Last Log: null')).toBeInTheDocument();
    expect(screen.getByText('Refresh Date:')).toBeInTheDocument();
  });

  /**
   * Test to ensure device-related states can be set and updated correctly.
   */
  test('sets and updates device-related states', () => {
    render(
      <DeviceProvider>
        <TestDeviceComponent testSetters={true} />
      </DeviceProvider>
    );

    expect(screen.getByText(`Devices: ${JSON.stringify(mockDevices)}`)).toBeInTheDocument();
    expect(screen.getByText(`Device: ${JSON.stringify(mockDevices[1])}`)).toBeInTheDocument();
    expect(screen.getByText(`Device Shadow: ${JSON.stringify(mockShadow)}`)).toBeInTheDocument();
    expect(screen.getByText(`Device Logs: ${JSON.stringify(mockDeviceLogs)}`)).toBeInTheDocument();
    expect(screen.getByText(`Last Log: ${JSON.stringify(mockDeviceLogs[1])}`)).toBeInTheDocument();
    expect(screen.getByText(`Refresh Date: ${mockDeviceLogs[1].log_date}`)).toBeInTheDocument();
  });

  /**
   * Tests that an error is thrown when useDevice is used outside of DeviceProvider.
   */
  test('throws error when useDevice is used outside DeviceProvider', () => {
    const TestErrorComponent = () => {
      useDevice();
      return <div>Test</div>;
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestErrorComponent />)).toThrow('useDevice must be used within a DeviceProvider');

    consoleErrorSpy.mockRestore();
  });
});
