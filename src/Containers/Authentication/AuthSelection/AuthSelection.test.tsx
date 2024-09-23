import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthSelection from './AuthSelection';

/**
 * Test suite for the AuthSelection component.
 */
describe('AuthSelection Component', () => {
    
    /**
     * Test to check if the AuthSelection component renders with the correct initial state.
     */
    test('renders the AuthSelection component with correct initial state', () => {
        const mockSetIsLoginSelected = jest.fn();
        
        render(
            <AuthSelection 
                isLoginSelected={true} 
                setIsLoginSelected={mockSetIsLoginSelected} 
            />
        );

        // Checks if the login button has the selected class and sign-up button has the default class.
        expect(screen.getByTestId('login-selection')).toHaveClass('userAuth-toggle-btn-selected');
        expect(screen.getByTestId('signup-selection')).toHaveClass('userAuth-toggle-btn');
    });

    /**
     * Test to check if the state is updated when the Login button is clicked.
     */
    test('updates state when Login button is clicked', () => {
        const mockSetIsLoginSelected = jest.fn();
        
        render(
            <AuthSelection 
                isLoginSelected={false} 
                setIsLoginSelected={mockSetIsLoginSelected} 
            />
        );

        // Simulates a click on the Login button and checks if the state is updated.
        fireEvent.click(screen.getByText('Login'));
        expect(mockSetIsLoginSelected).toHaveBeenCalledWith(true);
    });

    /**
     * Test to check if the state is updated when the Sign Up button is clicked.
     */
    test('updates state when Sign Up button is clicked', () => {
        const mockSetIsLoginSelected = jest.fn();
        
        render(
            <AuthSelection 
                isLoginSelected={true} 
                setIsLoginSelected={mockSetIsLoginSelected} 
            />
        );

        // Simulates a click on the Sign Up button and checks if the state is updated.
        fireEvent.click(screen.getByText('Sign Up'));
        expect(mockSetIsLoginSelected).toHaveBeenCalledWith(false);
    });
});
