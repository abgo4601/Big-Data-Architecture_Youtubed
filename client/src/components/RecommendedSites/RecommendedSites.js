import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';


const RecommendedSites = (props) => {
  const [streamingSites, setStreamingSites] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      const res = await axios.get(
        `https://streaming-availability.p.rapidapi.com/v2/search/title`,
        {
          headers: {

            'X-RapidAPI-Key': 'ca98e63c5bmshd5cb85ce155a29ep120dccjsn78e1cdc0d942',
            'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
          },
          params: {
            title: props.name,
            country: 'us',
            show_type: 'movie',
            output_language: 'en'
          }
        }
      )
      console.log(res.data.result[0].streamingInfo.us);
      const platformNames = Object.keys(res.data.result[0].streamingInfo.us);
      setStreamingSites(platformNames);
      console.log(platformNames);
      if (platformNames) {
        setLoading(false);
      }
    };
    fetchSites();

  }, [])



  // useEffect(() => {
  //     const fetchData = async () =>{
  //         console.log("Called fetch Data")
  //       //setLoading(true);
  //       try {
  //        // const {data: response} = await axios.get('/stuff/to/fetch');
  //        // setData(response);
  //       } catch (error) {
  //         console.error(error.message);
  //       }
  //       //setLoading(false);
  //     }

  //     fetchData();
  //   }, []);
  console.log(streamingSites)
  return (
    <div>
      {loading ? (
        <h5>Platforms Available...</h5>
      ) : (
        <div>
          <h5>Available in </h5>
          <ul>
            {streamingSites.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecommendedSites;