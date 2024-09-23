import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DeviceMenu from './DeviceMenu';
import { useDevice } from '../../../Provider/DeviceProvider/DeviceProvider';

// Mocking the DeviceProvider
jest.mock('../../../Provider/DeviceProvider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        devices: null,
        device: null,
        setDevice: jest.fn(),
    })),
}));

/**
 * Tests for the DeviceItem component.
 */
describe('DeviceMenu component', () => {
  const mockShowAddDeviceView = jest.fn();
  const mockShowPerformanceView = jest.fn();

  const mockDevices = [
    {
      device_id: 1,
      cat_num: '123456',
      user_id: 1,
      wifi_ssid: 'TestSSID1',
      wifi_password: 'password1',
      init_vec: 'init_vec1',
      presence_connection: true,
      location: 'Living Room',
      thing_name: 'TestDevice1',
    },
    {
      device_id: 2,
      cat_num: '654321',
      user_id: 2,
      wifi_ssid: 'TestSSID2',
      wifi_password: 'password2',
      init_vec: 'init_vec2',
      presence_connection: false,
      location: 'Kitchen',
      thing_name: 'TestDevice2',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useDevice as jest.Mock).mockReturnValue({
      device: null,
      devices: mockDevices,
      setDevice: jest.fn(),
    });

  });

  /**
   * Test rendering of the DeviceMenu with devices and search input.
   */
  it('renders the device menu with devices and search input', () => {
    render(
      <DeviceMenu
        connectDeviceToggle={false}
        showAddDeviceView={mockShowAddDeviceView}
        isSettingsVisible={false}
        showPerformanceView={mockShowPerformanceView}
      />
    );

    expect(screen.getByText('Devices')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByText('Living Room - 123456')).toBeInTheDocument();
    expect(screen.getByText('Kitchen - 654321')).toBeInTheDocument();
  });

  /**
   * Test that showAddDeviceView is called when the Plus icon is clicked.
   */
  it('calls showAddDeviceView when the Plus icon is clicked', () => {
    render(
      <DeviceMenu
        connectDeviceToggle={false}
        showAddDeviceView={mockShowAddDeviceView}
        isSettingsVisible={false}
        showPerformanceView={mockShowPerformanceView}
      />
    );

    const plusIcon = screen.getByAltText('Plus Icon');
    fireEvent.click(plusIcon);

    expect(mockShowAddDeviceView).toHaveBeenCalledTimes(1);
  });

  /**
   * Test filtering of devices based on search term.
   */
  it('filters devices based on search term', () => {
    render(
      <DeviceMenu
        connectDeviceToggle={false}
        showAddDeviceView={mockShowAddDeviceView}
        isSettingsVisible={false}
        showPerformanceView={mockShowPerformanceView}
      />
    );

    expect(screen.getByText('Living Room - 123456')).toBeInTheDocument();
    expect(screen.getByText('Kitchen - 654321')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Living' } });

    expect(screen.getByText('Living Room - 123456')).toBeInTheDocument();
    expect(screen.queryByText('Kitchen - 654321')).toBeNull();
  });

  /**
   * Test that the search term is reset when a new device is selected.
   */
  it('resets search term when a new device is selected', () => {
    (useDevice as jest.Mock).mockReturnValue({
      device: mockDevices[0],
      devices: mockDevices,
      setDevice: jest.fn(),
    });

    const { rerender } = render(
      <DeviceMenu
        connectDeviceToggle={false}
        showAddDeviceView={mockShowAddDeviceView}
        isSettingsVisible={false}
        showPerformanceView={mockShowPerformanceView}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Kitchen' } });

    expect(screen.getByText('Kitchen - 654321')).toBeInTheDocument();
    expect(screen.queryByText('Living Room - 123456')).toBeNull();

    (useDevice as jest.Mock).mockReturnValue({
      device: mockDevices[1],
      devices: mockDevices,
      setDevice: jest.fn(),
    });

    rerender(
      <DeviceMenu
        connectDeviceToggle={false}
        showAddDeviceView={mockShowAddDeviceView}
        isSettingsVisible={false}
        showPerformanceView={mockShowPerformanceView}
      />
    );

    expect(searchInput.value).toBe('');
  });
});
