import React from 'react';
import './LandingFileTab.css';

/**
 * Renders a tab interface for the landing page.
 *
 * @component
 * @returns {JSX.Element} The rendered tab component.
 */
export default function LandingFileTab(): JSX.Element{
    return(
        <div className="file-tab-container">
            <div className="file-tab"></div>
            <div className="file-tab-adjust">
                <div className="file-tab-adjust-2"></div>
            </div>
        </div>
    );
}