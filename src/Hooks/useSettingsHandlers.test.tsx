import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useSettingsHandlers } from './useSettingsHandlers';
import { postAddDevice, postUpdateUser, postUpdateWifi, postUpdateAuto, postUpdatePumpWater } from '../Services/ApiService/ApiService';

jest.mock('../Services/ApiService/ApiService', () => ({
    postAddDevice: jest.fn(),
    postUpdateUser: jest.fn(),
    postUpdateWifi: jest.fn(),
    postUpdateAuto: jest.fn(),
    postUpdatePumpWater: jest.fn(),
}));

const TestComponent = () => {
    const {
        handleUpdateUser,
        handleAddDevice,
        handleUpdateWifi,
        handleUpdateAuto,
        handleUpdatePumpWater,
        error,
        isLoading,
        resetError
    } = useSettingsHandlers();

    return (
        <div>
            <button
                onClick={() => {
                    handleUpdateUser(
                        { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>,
                        'test-token',
                        () => {},
                        { email: 'test@example.com', first_name: 'Test', last_name: 'User' },
                        (data) => (data)
                    );
                }}
            >
                Update User
            </button>
            <button
                onClick={() => {
                    handleUpdateUser(
                        { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>,
                        'test-token',
                        () => {},
                        { email: '', first_name: '', last_name: '' },
                        (data) => (data)
                    );
                }}
            >
                Update User Invalid
            </button>
            <button
                onClick={() => {
                    handleAddDevice(
                        'test-token',
                        () => {},
                        {
                            location: 'Room',
                            cat_num: '12345',
                            wifi_ssid: 'TestSSID',
                            wifi_password: 'TestPassword'
                        },
                        (data) => (data)
                    );
                }}
            >
                Add Device
            </button>
            <button
                onClick={() => {
                    handleAddDevice(
                        'test-token',
                        () => {},
                        {
                            location: '',
                            cat_num: '',
                            wifi_ssid: '',
                            wifi_password: ''
                        },
                        (data) => (data)
                    );
                }}
            >
                Add Device Invalid
            </button>
            <button
                onClick={() => {
                    handleUpdateWifi(
                        'test-token',
                        () => {},
                        { wifi_ssid: 'SSID', wifi_password: 'Password', device_id: 1 },
                        () => {}
                    );
                }}
            >
                Update Wifi
            </button>
            <button
                onClick={() => {
                    handleUpdateWifi(
                        'test-token',
                        () => {},
                        { wifi_ssid: '', wifi_password: '', device_id: 1 },
                        () => {}
                    );
                }}
            >
                Update Wifi Invalid
            </button>
            <button
                onClick={() => {
                    handleUpdateAuto(
                        'test-token',
                        () => {},
                        { state: { reported: { welcome: 'welcome', connected: true, auto: false, pump: false }, desired: { welcome: 'welcome', connected: true, auto: false, pump: false } } },
                        true,
                        { device_id: 1, automate: true }
                    );
                }}
            >
                Update Auto
            </button>
            <button
                onClick={() => {
                    handleUpdatePumpWater(
                        'test-token',
                        () => {},
                        { device_id: 1, pump_water: true },
                        () => {}
                    );
                }}
            >
                Update Pump Water
            </button>
            {error && <div data-testid="error">{error}</div>}
            {isLoading && <div data-testid="loading">Loading...</div>}
        </div>
    );
};

describe('useSettingsHandlers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle successful user update', async () => {
        (postUpdateUser as jest.Mock).mockResolvedValue({ data: { id: 1 } });

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Update User'));

        await waitFor(() => {
            expect(postUpdateUser).toHaveBeenCalled();
        });
    });

    it('should fail on update user validator', async () => {
        render(<TestComponent />);

        fireEvent.click(screen.getByText('Update User Invalid'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Email, first name, and last name are required.');
        });
    });

    it('should handle user update errors correctly', async () => {
        (postUpdateUser as jest.Mock).mockRejectedValue({ response: { data: { message: 'Update failed' } } });

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Update User'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('An unexpected error occurred. Please try again later.');
        });
    });
    
    it('should handle successful device addition', async () => {
        (postAddDevice as jest.Mock).mockResolvedValue({ data: { id: 1 } });

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Add Device'));

        await waitFor(() => {
            expect(postAddDevice).toHaveBeenCalled();
        });
    });

    it('should fail on add device validator', async () => {
        render(<TestComponent />);

        fireEvent.click(screen.getByText('Add Device Invalid'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Location, asset number, Wifi SSID, and Wifi Password required');
        });
    });

    it('should add device errors correctly', async () => {
        (postAddDevice as jest.Mock).mockRejectedValue({ response: { data: { message: 'Add device failed' } } });

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Add Device'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('An unexpected error occurred. Please try again later.');
        });
    });

    it('should handle successful wifi update', async () => {
        (postUpdateWifi as jest.Mock).mockResolvedValue({ data: { id: 1 } });

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Update Wifi'));

        await waitFor(() => {
            expect(postUpdateWifi).toHaveBeenCalled();
        });
    });

    it('should fail on update wifi validator', async () => {
        render(<TestComponent />);

        fireEvent.click(screen.getByText('Update Wifi Invalid'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Device id, Wifi SSID, and Wifi Password required');
        });
    });

    it('should handle update wifi errors correctly', async () => {
        (postUpdateWifi as jest.Mock).mockRejectedValue({ response: { data: { message: 'Update wifi failed' } } });

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Update Wifi'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('An unexpected error occurred. Please try again later.');
        });
    });

    it('should handle successful auto update', async () => {
        (postUpdateAuto as jest.Mock).mockResolvedValue({ data: { id: 1 } });

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Update Auto'));

        await waitFor(() => {
            expect(postUpdateAuto).toHaveBeenCalled();
        });
    });

    it('should handle update auto errors correctly', async () => {
        (postUpdateAuto as jest.Mock).mockRejectedValue({ response: { data: { message: 'Update auto failed' } } });

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Update Auto'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('An unexpected error occurred. Please try again later.');
        });
    });

    it('should handle successful pump update', async () => {
        (postUpdatePumpWater as jest.Mock).mockResolvedValue({ data: { id: 1 } });

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Update Pump Water'));

        await waitFor(() => {
            expect(postUpdatePumpWater).toHaveBeenCalled();
        });
    });

    it('should handle update pump errors correctly', async () => {
        (postUpdatePumpWater as jest.Mock).mockRejectedValue({ response: { data: { message: 'Update pump failed' } } });

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Update Pump Water'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('An unexpected error occurred. Please try again later.');
        });
    });

    it('should handle loading state correctly', async () => {
        (postUpdateAuto as jest.Mock).mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({}), 500)));

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Update Auto'));

        expect(screen.getByTestId('loading')).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.queryByTestId('loading')).toBeNull();
        });
    });

    it('should reset error state', async () => {
        (postUpdateUser as jest.Mock).mockRejectedValue({ response: { data: { message: 'Update failed' } } });

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Update User'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('An unexpected error occurred. Please try again later.');
        });

        (postUpdateUser as jest.Mock).mockResolvedValue({ data: { id: 1 } });

        fireEvent.click(screen.getByText('Update User'));

        await waitFor(() => {
            expect(screen.queryByTestId('error')).toBeNull();
        });
    });
});
