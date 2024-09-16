import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingFileTab from './LandingFileTab';

describe('LandingFileTab Component', () => {
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
