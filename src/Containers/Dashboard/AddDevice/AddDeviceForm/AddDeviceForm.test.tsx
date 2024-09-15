import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddDeviceForm from './AddDeviceForm';

describe('AddDeviceForm Component', () => {
    const mockHandleConnectClick = jest.fn();
    const mockHandleInputChange = jest.fn();
    const errorMessage = 'This is an error message';

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
