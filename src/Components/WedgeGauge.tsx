import React from 'react';
import { Gauge, gaugeClasses  } from '@mui/x-charts/Gauge';

interface WedgeGaugeProps {
    className?: string;
    value: number;
}

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