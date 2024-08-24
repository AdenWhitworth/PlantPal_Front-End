import React from 'react';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { BarChart  } from '@mui/x-charts/BarChart';

const chartSetting = {
    yAxis: [
        {
            label: 'Times Watered',
        },
    ],
    series: [
        { 
            dataKey: 'times', 
            valueFormatter: (value) => `${value}x`, 
            color:'#C1E899' 
        }],
    sx: {
        [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: 'translateX(-10px)',
        },
    },
};

export default function Auto({
    waterOccurance
}) {

    return (
        <div className='auto'>
            <BarChart
                dataset={waterOccurance}
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