import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Myloader from "react-spinners/PuffLoader";
import SingleData from "../../components/SingleData/SingleData";
import "./Home.css";
import "../PagesStyles.css";

const TMDB_KEY = "dfe8923f3e487ce951bd22dcd3dfccfc";

const Home = () => {
  const [allContent, setAllContent] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line
  let [color, setColor] = useState("grey");

  const fetchPopularMovieApi = async () => {
    try {
      const { data } = await axios.get(` 
     https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_KEY}&page=1`);
      const alldata = data.results;
      const filter = alldata.slice(0, 7);
      setAllContent(filter);
      setIsLoading(true);

      // eslint-disable-next-line
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPopularSeriesApi = async () => {
    try {
      const { data } = await axios.get(` 
      https://api.themoviedb.org/3/tv/on_the_air?api_key=${TMDB_KEY}&page=1`);
      const alldata = data.results;
      const filter = alldata.slice(0, 7);
      setPopularSeries(filter);
      setIsLoading(true);

      // eslint-disable-next-line
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);

    fetchPopularMovieApi();
    fetchPopularSeriesApi();
    // eslint-disable-next-line
    return () => {
      setPopularSeries();
      setAllContent();
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <div className='TreadingHome3 pt-4'>
            <div className='title__home'>
              <div className='btn__home'>
                <h6>
                  Recommended Movies &#160;
                  <span style={{ paddingTop: "10px" }}>&#11166;</span>
                </h6>
              </div>
            </div>

            <div className='ListContent2'>
              {allContent &&
                allContent.map((n) => (
                  <SingleData key={n.id} {...n} mediaType='movie' />
                ))}
            </div>
          </div>
          <hr />
          <div className='TreadingHome3'>
            <div className='title__home'>
              <div className='btn__home'>
                <h6>
                  Recommended Shows &#160;
                  <span style={{ paddingTop: "10px" }}>&#11166;</span>
                </h6>
              </div>
            </div>
            <div className='ListContent2'>
              {popularSeries &&
                popularSeries.map((n) => (
                  <SingleData key={n.id} mediaType='tv' {...n} />
                ))}
            </div>
          </div>
          <hr />
          <div className='TreadingHome3'>
            <div className='title__home'>
              <div className='btn__home' style={{ width: "160px" }}>
                <h6>
                  Recommended Songs &#160;
                  <span style={{ paddingTop: "10px" }}>&#11166;</span>
                </h6>
              </div>
            </div>
            {<h2>Songs</h2>}
          </div>
        </>
      ) : (
        <div className='major' style={{ height: "600px" }}>
          <Myloader color={color} size={60} />
        </div>
      )}
    </>
  );
};

export default Home;
