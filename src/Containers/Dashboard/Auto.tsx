import React from 'react';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { BarChart } from '@mui/x-charts/BarChart';

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

interface WaterOccurrence {
    date: string;
    times: number;
}

interface AutoProps {
    waterOccurance: WaterOccurrence[];
}

export default function Auto({
    waterOccurance
}:AutoProps) {

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