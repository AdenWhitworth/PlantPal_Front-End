import React from 'react';
import { render } from '@testing-library/react';
import LandingFileTab from './LandingFileTab';

/**
 * Tests for the LandingFileTab component.
 */
describe('LandingFileTab Component', () => {
    /**
     * Test to ensure the file tab container and its nested divs are rendered correctly.
     */
    test('renders the file tab container and nested divs correctly', () => {
        const { container } = render(<LandingFileTab />);

        const containerDiv = container.querySelector('.file-tab-container');
        expect(containerDiv).toBeInTheDocument();

        const fileTab = container.querySelector('.file-tab');
        expect(fileTab).toBeInTheDocument();

        const fileTabAdjust = container.querySelector('.file-tab-adjust');
        expect(fileTabAdjust).toBeInTheDocument();

        const fileTabAdjust2 = container.querySelector('.file-tab-adjust-2');
        expect(fileTabAdjust2).toBeInTheDocument();
    });
});
