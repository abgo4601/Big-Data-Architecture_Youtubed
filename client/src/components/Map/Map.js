import React, {useEffect} from 'react';
import axios from "axios";
import Plot from 'react-plotly.js';

function Map({title}) {

    useEffect(() => {
        const fetchAPI = async () => {
            const response = await axios.get(`http://localhost:5000/heat-map?title=${title}`)
            console.log('title', response);
        }
        fetchAPI()
    }, []);

    const data = [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: ['United States', 'Canada', 'Mexico'],
        z: [1, 2, 20, 4],
        colorscale: 'Viridis',
        autocolorscale: false,
        reversescale: true,
        marker: {
            line: {
                color: 'rgb(0,150,180)', width: 0, showscale: false
            },
        },
        colorbar: {
            title: 'Data', thickness: 0,
        },
    },];

    const layout = {
        geo: {
            projection: {
                type: 'mercator',
            },
        }, plot_bgcolor: "#150132", paper_bgcolor: "#150132", autosize: false, width: 1500, height: 900,
    };


    return (<div style={{display: "flex"}}>
            <Plot
                data={data}
                layout={layout}
                useResizeHandler={true}
                style={{width: '100%', height: '100%'}}
            />
        </div>);
}

export default Map;