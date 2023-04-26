import React from 'react';
import Plot from 'react-plotly.js';

const data = [
    {
        date_from: '2022-08-14',
        date_to: '2022-08-20',
        count: 10,
    },
    {
        date_from: '2022-08-20',
        date_to: '2022-08-26',
        count: 19,
    },
    {
        date_from: '2022-08-27',
        date_to: '2022-09-05',
        count: 57,
    },
];

const xValues = data.map(item => item.date_from);
const yValues = data.map(item => item.count);

const tickVals = data.map(item => `${item.date_from} to ${item.date_to}`);
const tickText = data.map(item => `${item.date_from.slice(5)}-${item.date_to.slice(5)}`);

const LineGraph = () => {
    return (
        <Plot
            data={[
                {
                    x: xValues,
                    y: yValues,
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: { color: 'blue' },
                },
            ]}
            layout={{
                width: 800,
                height: 500,
                title: 'Views througout one year',
                xaxis: {
                    title: 'Date Range',
                    tickmode: 'array',
                    tickvals: tickVals,
                    ticktext: tickText
                },
                yaxis: { title: 'Count' },
            }}
        />
    );
};

export default LineGraph;