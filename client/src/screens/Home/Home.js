import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Myloader from "react-spinners/PuffLoader";
import SingleData from "../../components/SingleData/SingleData";
import "./Home.css";

const TMDB_KEY = "dfe8923f3e487ce951bd22dcd3dfccfc";

const Home = () => {
  const [allContent, setAllContent] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const songs = [
    {
      poster_path:
        "https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a",
      title: "Bohemian Rhapsody - Remastered 2011",
      id: "7tFiyTwD0nx5a1eklYtX2J",
      artist: "Queen",
      release_date: "1975-11-21",
      vote_average: 7.5,
      mediaType: "Song",
    },
    {
      poster_path:
        "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69",
      title: "Stairway to Heaven - Remaster",
      id: "5CQ30WqJwcep0pYcV4AMNc",
      artist: "Led Zeppelin",
      release_date: "1971-11-08",
      vote_average: 8.0,
      mediaType: "Song",
    },
    {
      poster_path:
        "https://i.scdn.co/image/ab67616d0000b2734637341b9f507521afa9a778",
      title: "Hotel California - 2013 Remaster",
      id: "40riOy7x9W7GXjyGp4pjAv",
      artist: "Eagles",
      release_date: "1976-12-08",
      vote_average: 8.5,
      mediaType: "Song",
    },
    {
      poster_path:
        "https://i.scdn.co/image/ab67616d0000b27321ebf49b3292c3f0f575f0f5",
      title: "Sweet Child O' Mine",
      id: "7snQQk1zcKl8gZ92AnueZW",
      artist: "Guns N' Roses",
      release_date: "1987-07-21",
      vote_average: 8.6,
      mediaType: "Song",
    },
    {
      poster_path:
        "https://i.scdn.co/image/ab67616d0000b27399581550ef9746ca582bb3cc",
      title: "Imagine - Remastered 2010",
      id: "7pKfPomDEeI4TPT6EOYjn9",
      artist: "John Lennon",
      release_date: "1971-09-09",
      vote_average: 7.9,
      mediaType: "Song",
    },
    {
      poster_path:
        "https://i.scdn.co/image/ab67616d0000b27341720ef0ae31e10d39e43ca2",
      title: "Like a Rolling Stone",
      id: "3AhXZa8sUQht0UEdBJgpGc",
      artist: "Bob Dylan",
      release_date: "1965-08-30",
      vote_average: 7.1,
      mediaType: "Song",
    },
    {
      poster_path:
        "https://i.scdn.co/image/ab67616d0000b273582d56ce20fe0146ffa0e5cf",
      title: "Hey Jude - Remastered 2015",
      id: "0aym2LBJBk9DAYuHHutrIl",
      artist: "The Beatles",
      release_date: "2000-11-13",
      vote_average: 7.5,
      mediaType: "Song",
    },
  ];
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
