import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Myloader from "react-spinners/PuffLoader";
import SingleData from "../../components/SingleData/SingleData";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export const BACKEND_URL = "http://127.0.0.1:5000";
const TMDB_KEY = "dfe8923f3e487ce951bd22dcd3dfccfc";

const Home = () => {
  const [allContent, setAllContent] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      const query = new URLSearchParams(window.location.search);
      const token = query.get("token");
      if (token) {
        localStorage.setItem("token", token);
      }
    }

    axios
      .get(`${BACKEND_URL}/recommendations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setAllContent(res.data.movies.slice(0, 7));
        setPopularSeries(res.data.shows.slice(0, 7));
        setSongs(res.data.songs.slice(0, 7));
        setIsLoading(true);
      })
      .catch((err) => console.log(err));
  });

  // eslint-disable-next-line
  let [color, setColor] = useState("grey");

  return (
    <>
      {isLoading ? (
        <>
          <div className='HomeStyle pt-4'>
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
          <div className='HomeStyle'>
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
          <div className='HomeStyle'>
            <div className='title__home'>
              <div className='btn__home' style={{ width: "160px" }}>
                <h6>
                  Recommended Songs &#160;
                  <span style={{ paddingTop: "10px" }}>&#11166;</span>
                </h6>
              </div>
            </div>
            <div className='ListContent2'>
              {songs &&
                songs.map((n) => (
                  <SingleData key={n.id} mediaType='song' {...n} />
                ))}
            </div>
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
