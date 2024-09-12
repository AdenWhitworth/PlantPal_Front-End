import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal component tests', () => {

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
