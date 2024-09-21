import React from 'react';
import './LoadingDots.css';

/**
 * A functional React component that renders a loading animation with three dots.
 * 
 * This component uses a CSS class `loading-dots` to animate the dots. It is used
 * to indicate a loading state in the application.
 * 
 * @component
 * @example
 * return (
 *   <LoadingDots />
 * )
 */
export default function LoadingDots () {

    return (
        <div className="loading-dots" data-testid="loading-dots">
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};