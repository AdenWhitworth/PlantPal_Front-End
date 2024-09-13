import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthSelection from './AuthSelection';

describe('AuthSelection Component', () => {
    test('renders the AuthSelection component with correct initial state', () => {
        const mockSetIsLoginSelected = jest.fn();
        
        render(
            <AuthSelection 
                isLoginSelected={true} 
                setIsLoginSelected={mockSetIsLoginSelected} 
            />
        );

        expect(screen.getByTestId('login-selection')).toHaveClass('userAuth-toggle-btn-selected');
        expect(screen.getByTestId('signup-selection')).toHaveClass('userAuth-toggle-btn');
    });

    test('updates state when Login button is clicked', () => {
        const mockSetIsLoginSelected = jest.fn();
        
        render(
            <AuthSelection 
                isLoginSelected={false} 
                setIsLoginSelected={mockSetIsLoginSelected} 
            />
        );

        fireEvent.click(screen.getByText('Login'));
        expect(mockSetIsLoginSelected).toHaveBeenCalledWith(true);
    });

    test('updates state when Sign Up button is clicked', () => {
        const mockSetIsLoginSelected = jest.fn();
        
        render(
            <AuthSelection 
                isLoginSelected={true} 
                setIsLoginSelected={mockSetIsLoginSelected} 
            />
        );

        fireEvent.click(screen.getByText('Sign Up'));
        expect(mockSetIsLoginSelected).toHaveBeenCalledWith(false);
    });
});
