import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddDeviceForm from './AddDeviceForm';

/**
 * Tests for the AddDeviceForm component.
 */
describe('AddDeviceForm Component', () => {
    const mockHandleConnectClick = jest.fn();
    const mockHandleInputChange = jest.fn();
    const errorMessage = 'This is an error message';

    /**
     * Test to check if the AddDeviceForm component renders correctly.
     */
    test('renders the AddDeviceForm component correctly', () => {
        render(
            <AddDeviceForm
                handleConnectClick={mockHandleConnectClick}
                handleInputChange={mockHandleInputChange}
                error={null}
            />
        );

        expect(screen.getByText('New Device')).toBeInTheDocument();
        expect(screen.getByAltText('New device logo')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Location')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Asset Number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Wifi SSID')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Wifi Password')).toBeInTheDocument();
        expect(screen.getByText('Connect')).toBeInTheDocument();
    });

    /**
     * Test to verify that input changes are handled correctly.
     */
    test('handles input changes', () => {
        render(
            <AddDeviceForm
                handleConnectClick={mockHandleConnectClick}
                handleInputChange={mockHandleInputChange}
                error={null}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('Location'), {
            target: { value: 'Kitchen' }
        });

        fireEvent.change(screen.getByPlaceholderText('Asset Number'), {
            target: { value: '123456' }
        });

        fireEvent.change(screen.getByPlaceholderText('Wifi SSID'), {
            target: { value: 'TestSSID' }
        });

        fireEvent.change(screen.getByPlaceholderText('Wifi Password'), {
            target: { value: 'password123' }
        });

        expect(mockHandleInputChange).toHaveBeenCalled();
    });

    /**
     * Test to check if form submission is handled correctly.
     */
    test('handles form submission', () => {
        render(
            <AddDeviceForm
                handleConnectClick={mockHandleConnectClick}
                handleInputChange={mockHandleInputChange}
                error={null}
            />
        );

        fireEvent.submit(screen.getByTestId('add-form'));
        expect(mockHandleConnectClick).toHaveBeenCalled();
    });

    /**
     * Test to verify that an error message is displayed when present.
     */
    test('displays error message when present', () => {
        render(
            <AddDeviceForm
                handleConnectClick={mockHandleConnectClick}
                handleInputChange={mockHandleInputChange}
                error={errorMessage}
            />
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
});
