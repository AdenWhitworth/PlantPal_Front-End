import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

/**
 * Tests for the Modal component.
 * 
 * This suite contains various tests to ensure the Modal component renders correctly
 * under different conditions, including the presence or absence of close and action buttons.
 */
describe('Modal component tests', () => {

    /**
     * Test to verify that the Modal renders without close and action buttons.
     */
    test('renders without close and action buttons', () => {
        render(
            <Modal
                buttonLabel="Click Me"
                styleType="primary"
                addButton={false}
                addClose={false}
            >
                <div>Modal Content</div>
            </Modal>
        );

        expect(screen.getByText('Modal Content')).toBeInTheDocument();
        expect(screen.queryByAltText('Close Icon')).not.toBeInTheDocument();
        expect(screen.queryByText('Click Me')).not.toBeInTheDocument();
    });

    /**
     * Test to verify that the Modal renders with a close button and handles click events.
     */
    test('renders with close button', () => {
        const handleCloseClick = jest.fn();
        
        render(
            <Modal
                buttonLabel="Click Me"
                styleType="primary"
                addButton={false}
                addClose={true}
                handleCloseClick={handleCloseClick}
            >
                <div>Modal Content</div>
            </Modal>
        );

        expect(screen.getByText('Modal Content')).toBeInTheDocument();
        const closeButton = screen.getByAltText('Close Icon');
        expect(closeButton).toBeInTheDocument();
        
        fireEvent.click(closeButton);
        expect(handleCloseClick).toHaveBeenCalledTimes(1);
    });

    /**
     * Test to verify that the Modal renders with an action button and handles click events.
     */
    test('renders with action button', () => {
        const handleButtonClick = jest.fn();

        render(
            <Modal
                buttonLabel="Click Me"
                styleType="primary"
                addButton={true}
                addClose={false}
                handleButtonClick={handleButtonClick}
            >
                <div>Modal Content</div>
            </Modal>
        );

        expect(screen.getByText('Modal Content')).toBeInTheDocument();
        const actionButton = screen.getByText('Click Me');
        expect(actionButton).toBeInTheDocument();
        
        fireEvent.click(actionButton);
        expect(handleButtonClick).toHaveBeenCalledTimes(1);
    });

    /**
     * Test to verify that the Modal renders with both close and action buttons, and that
     * both buttons handle click events appropriately.
     */
    test('renders with both close and action buttons', () => {
        const handleCloseClick = jest.fn();
        const handleButtonClick = jest.fn();
        
        render(
            <Modal
                buttonLabel="Click Me"
                styleType="primary"
                addButton={true}
                addClose={true}
                handleCloseClick={handleCloseClick}
                handleButtonClick={handleButtonClick}
            >
                <div>Modal Content</div>
            </Modal>
        );

        expect(screen.getByText('Modal Content')).toBeInTheDocument();
        const closeButton = screen.getByAltText('Close Icon');
        expect(closeButton).toBeInTheDocument();
        const actionButton = screen.getByText('Click Me');
        expect(actionButton).toBeInTheDocument();
        
        fireEvent.click(closeButton);
        expect(handleCloseClick).toHaveBeenCalledTimes(1);

        fireEvent.click(actionButton);
        expect(handleButtonClick).toHaveBeenCalledTimes(1);
    });

});

