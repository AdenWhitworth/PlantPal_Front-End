import React from 'react';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { BarChart } from '@mui/x-charts/BarChart';
import './Auto.css';
import { AutoProps } from './AutoTypes';

/**
 * Chart settings for the BarChart component.
 * 
 * @constant {Object} chartSetting
 * @property {Object[]} yAxis - Configuration for the Y-axis.
 * @property {Object[]} series - Configuration for the series displayed in the chart.
 * @property {Object} sx - Custom styles for the chart components.
 */
const chartSetting = {
    yAxis: [
        {
            label: 'Times Watered',
        },
    ],
    series: [
        { 
            type: 'bar' as 'bar',
            dataKey: 'times', 
            valueFormatter: (value: number | null) => value !== null ? `${value}x` : 'N/A', 
            color: '#C1E899' 
        }
    ],
    sx: {
        [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: 'translateX(-10px)',
        },
    },
};

/**
 * The Auto component displays a bar chart representing watering occurrences.
 *
 * @component
 * @param {AutoProps} props - The props for the component.
 * @param {WaterOccurrence[]} props.waterOccurance - An array of water occurrence records.
 * @returns {JSX.Element} The rendered Auto component containing a bar chart.
 */
export default function Auto({
    waterOccurance
}:AutoProps): JSX.Element {

    const dataset = waterOccurance.map((occurrence) => ({
        date: occurrence.date,
        times: occurrence.times,
    }));

    return (
        <div className='auto'>
            <BarChart
                dataset={dataset}
                xAxis={[
                    { 
                        scaleType: 'band', 
                        dataKey: 'date', 
                        tickPlacement:'middle', 
                        tickLabelPlacement:'middle'
                    },
                ]}
                {...chartSetting}
                borderRadius={5}
            />
        </div>
    );
}