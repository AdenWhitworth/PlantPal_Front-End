import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConfirmActionModal from './ConfirmActionModal';
import { useAuth } from '../../Provider/AuthProvider/AuthProvider';
import { useDevice } from '../../Provider/DeviceProvider/DeviceProvider';
import { useSettingsHandlers } from '../../Hooks/useSettingsHandlers/useSettingsHandlers';

//Mocking the AuthProvider
jest.mock('../../Provider/AuthProvider/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        accessToken: null,
        setAccessToken: jest.fn(),
    })),
}));

//Mocking the DeviceProvider
jest.mock('../../Provider/DeviceProvider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        device: null,
        deviceShadow: null,
    })),
}));

//Mocking the useSettingsHandlers
jest.mock('../../Hooks/useSettingsHandlers/useSettingsHandlers', () => ({
    useSettingsHandlers: jest.fn(() => ({
        handleUpdateAuto: jest.fn(),
        error: null,
        resetError: jest.fn(),
    })),
}));

/**
 * Test suite for the ConfirmActionModal component.
 */
describe('ConfirmActionModal', () => {
    const mockSetAutoSwitch = jest.fn();
    const mockSetConfirmAuto = jest.fn();
    const mockHandleUpdateAuto = jest.fn();
    const mockResetError = jest.fn();

  beforeEach(() => {
      jest.clearAllMocks();

      (useAuth as jest.Mock).mockReturnValue({
          accessToken: 'test-access-token',
          setAccessToken: jest.fn(),
      });
  
      (useDevice as jest.Mock).mockReturnValue({
          device: { device_id: '12345' },
          deviceShadow: {},
      });
  
      (useSettingsHandlers as jest.Mock).mockReturnValue({
          handleUpdateAuto: mockHandleUpdateAuto,
          error: null,
          resetError: mockResetError,
      });
  });
  
  /**
   * Test that the ConfirmActionModal renders correctly with provided props.
   */
  it('should render correctly with provided props', () => {
    render(
      <ConfirmActionModal
        mainIcon="test-icon.svg"
        setAutoSwitch={mockSetAutoSwitch}
        setConfirmAuto={mockSetConfirmAuto}
        autoSwitch={false}
      >
        Confirm Action
      </ConfirmActionModal>
    );

    expect(screen.getByAltText('Confirm Action Icon')).toHaveAttribute('src', 'test-icon.svg');
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.queryByText('error-message')).not.toBeInTheDocument();
  });

  /**
   * Test that clicking the close button calls setAutoSwitch and setConfirmAuto with the correct values.
   */
  it('should call setAutoSwitch and setConfirmAuto with correct values when close button is clicked', () => {
    render(
      <ConfirmActionModal
        mainIcon="test-icon.svg"
        setAutoSwitch={mockSetAutoSwitch}
        setConfirmAuto={mockSetConfirmAuto}
        autoSwitch={false}
      >
        Confirm Action
      </ConfirmActionModal>
    );

    fireEvent.click(screen.getByAltText('Close Icon'));
    expect(mockSetAutoSwitch).toHaveBeenCalledWith(true);
    expect(mockSetConfirmAuto).toHaveBeenCalledWith(false);
  });

  /**
   * Test that clicking the Accept button calls handleUpdateAuto with correct parameters.
   */
  it('should call handleUpdateAuto with correct parameters when Accept button is clicked', async () => {
    render(
      <ConfirmActionModal
        mainIcon="test-icon.svg"
        setAutoSwitch={mockSetAutoSwitch}
        setConfirmAuto={mockSetConfirmAuto}
        autoSwitch={true}
      >
        Confirm Action
      </ConfirmActionModal>
    );

    fireEvent.click(screen.getByText('Accept'));

    await waitFor(() => {
      expect(mockHandleUpdateAuto).toHaveBeenCalledWith(
        'test-access-token',
        expect.any(Function),
        {},
        true,
        { device_id: '12345', automate: true }
      );
    });
  });

  /**
   * Test that the error message is rendered when an error exists.
   */
  it('should render error message when error exists', () => {

    (useSettingsHandlers as jest.Mock).mockReturnValue({
      handleUpdateAuto: mockHandleUpdateAuto,
      error: 'An error occurred',
      resetError: mockResetError,
    });

    render(
      <ConfirmActionModal
        mainIcon="test-icon.svg"
        setAutoSwitch={mockSetAutoSwitch}
        setConfirmAuto={mockSetConfirmAuto}
        autoSwitch={false}
      >
        Confirm Action
      </ConfirmActionModal>
    );

    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  /**
   * Test that resetError is called on component mount.
   */
  it('should call resetError on mount', () => {
    render(
      <ConfirmActionModal
        mainIcon="test-icon.svg"
        setAutoSwitch={mockSetAutoSwitch}
        setConfirmAuto={mockSetConfirmAuto}
        autoSwitch={false}
      >
        Confirm Action
      </ConfirmActionModal>
    );

    expect(mockResetError).toHaveBeenCalled();
  });
});
