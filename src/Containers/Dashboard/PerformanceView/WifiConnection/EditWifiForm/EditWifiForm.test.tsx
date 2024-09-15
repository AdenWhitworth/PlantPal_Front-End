import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditWifiForm from './EditWifiForm';

describe('EditWifiForm Component', () => {
    const mockHandleInputChange = jest.fn();
    const mockHandleUpdateWifiSubmit = jest.fn();
    const errorMessage = 'This is an error message';

    test('renders the EditWifiForm component correctly', () => {
        render(
            <EditWifiForm
                handleInputChange={mockHandleInputChange}
                handleUpdateWifiSubmit={mockHandleUpdateWifiSubmit}
                error={null}
            />
        );

        expect(screen.getByText('Connection')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Wifi SSID')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Wifi Password')).toBeInTheDocument();
        expect(screen.getByText('Connect Wifi?')).toBeInTheDocument();
    });

    test('handles input changes', () => {
        render(
            <EditWifiForm
                handleInputChange={mockHandleInputChange}
                handleUpdateWifiSubmit={mockHandleUpdateWifiSubmit}
                error={null}
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

    test('handles form submission', () => {
        render(
            <EditWifiForm
                handleInputChange={mockHandleInputChange}
                handleUpdateWifiSubmit={mockHandleUpdateWifiSubmit}
                error={null}
            />
        );

        fireEvent.submit(screen.getByTestId('wifi-form'));
        expect(mockHandleUpdateWifiSubmit).toHaveBeenCalled();
    });

    test('displays error message when present', () => {
        render(
            <EditWifiForm
                handleInputChange={mockHandleInputChange}
                handleUpdateWifiSubmit={mockHandleUpdateWifiSubmit}
                error={errorMessage}
            />
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
});