import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditWifiForm from './EditWifiForm';

/**
 * Test suite for the EditWifiForm component.
 */
describe('EditWifiForm Component', () => {
    const mockHandleInputChange = jest.fn();
    const mockHandleUpdateWifiSubmit = jest.fn();
    const mockHandleCloseClick = jest.fn();
    const errorMessage = 'This is an error message';

    /**
     * Test to verify the correct rendering of the EditWifiForm component.
     */
    test('renders the EditWifiForm component correctly', () => {
        render(
            <EditWifiForm
                handleInputChange={mockHandleInputChange}
                handleUpdateWifiSubmit={mockHandleUpdateWifiSubmit}
                error={null}
                connectionLoading={false}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        expect(screen.getByText('Connection')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Wifi SSID')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Wifi Password')).toBeInTheDocument();
        expect(screen.getByText('Connect Device?')).toBeInTheDocument();
    });

    /**
     * Test to verify that input changes are handled correctly.
     */
    test('handles input changes', () => {
        render(
            <EditWifiForm
                handleInputChange={mockHandleInputChange}
                handleUpdateWifiSubmit={mockHandleUpdateWifiSubmit}
                error={null}
                connectionLoading={false}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('Wifi SSID'), {
            target: { value: 'test_ssid' }
        });
        fireEvent.change(screen.getByPlaceholderText('Wifi Password'), {
            target: { value: 'test_password' }
        });

        expect(mockHandleInputChange).toHaveBeenCalled();
    });

    /**
     * Test to verify that form submission is handled correctly.
     */
    test('handles form submission', () => {
        render(
            <EditWifiForm
                handleInputChange={mockHandleInputChange}
                handleUpdateWifiSubmit={mockHandleUpdateWifiSubmit}
                error={null}
                connectionLoading={false}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        fireEvent.submit(screen.getByTestId('wifi-form'));
        expect(mockHandleUpdateWifiSubmit).toHaveBeenCalled();
    });

    /**
     * Test to verify that an error message is displayed when present.
     */
    test('displays error message when present', () => {
        render(
            <EditWifiForm
                handleInputChange={mockHandleInputChange}
                handleUpdateWifiSubmit={mockHandleUpdateWifiSubmit}
                error={errorMessage}
                connectionLoading={false}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    /**
     * Test to verify that the close button works correctly.
     */
    test('handles close button click', () => {
        render(
            <EditWifiForm
                handleInputChange={mockHandleInputChange}
                handleUpdateWifiSubmit={mockHandleUpdateWifiSubmit}
                error={null}
                connectionLoading={false}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        fireEvent.click(screen.getByAltText('Close Icon'));
        expect(mockHandleCloseClick).toHaveBeenCalled();
    });

    /**
     * Test to verify the loading state of the button during form submission.
     */
    test('shows loading state when connectionLoading is true', () => {
        render(
            <EditWifiForm
                handleInputChange={mockHandleInputChange}
                handleUpdateWifiSubmit={mockHandleUpdateWifiSubmit}
                error={null}
                connectionLoading={true}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        expect(screen.getByText('Connecting...')).toBeInTheDocument();
    });
});