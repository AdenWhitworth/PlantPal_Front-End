import React from 'react';
import { Gauge, gaugeClasses  } from '@mui/x-charts/Gauge';

/**
 * A gauge component that visually represents a value within a specified range.
 *
 * @param {WedgeGaugeProps} props - The properties for the WedgeGauge component.
 * @returns {JSX.Element} The rendered gauge component.
 */
export default function WedgeGauge ({
    className,
    value
}: WedgeGaugeProps) {
    return (
        <Gauge
            className={className}
            value={value}
            startAngle={-90}
            endAngle={90}
            innerRadius="60%"
            outerRadius="100%"
            cornerRadius="20%"
            sx={{
                [`& .${gaugeClasses.valueText}`]: {
                    display: 'none',
                },
                [`& .${gaugeClasses.valueArc}`]: {
                    fill: '#C1E899',
                },
                [`& .${gaugeClasses.referenceArc}`]: {
                    fill: '#D9D9D9',
                },
            }}
        />
    );
};