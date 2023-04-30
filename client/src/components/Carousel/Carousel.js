import axios from "axios";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { img_300, noPicture } from "../../images/Default";
import "./Carousel.css";
const handleDragStart = (e) => e.preventDefault();

const TMDB_KEY = "dfe8923f3e487ce951bd22dcd3dfccfc";
const SPOTIFY_CLIENT_ID = "580c268cc1c142abb5e4697ca23b19a4";
const SPOTIFY_CLIENT_SECRET = "8bc9e2a2a2794c909fcbf4db3e1280b4";

const Gallery = ({ mediaType, id }) => {
  const [credits, setCredits] = useState();

  const responsive = {
    0: {
      items: 1,
    },
    380: {
      items: 1,
    },
    512: {
      items: 2,
    },
    665: {
      items: 3,
    },
    767: {
      items: 3,
    },
    870: {
      items: 4,
    },
    1024: {
      items: 6,
    },
    1265: {
      items: 7,
    },
  };

  const items = credits?.map((n) => {
    return (
      <div className='carousel__d'>
        {mediaType !== "Song" ? (
          <img
            src={n.profile_path ? `${img_300}/${n.profile_path}` : noPicture}
            alt=''
            className='caro_img'
            onDragStart={handleDragStart}
          />
        ) : (
          <img
            src={n.profile_path ? n.profile_path : noPicture}
            alt=''
            className='caro_img'
            onDragStart={handleDragStart}
          />
        )}
        <div className='caro__details'>
          <h6 className='cast__name'>{n.original_name}</h6>
          <h6 className='character'>{n.character}</h6>
        </div>
      </div>
    );
  });

  const fetchCredits = async () => {
    try {
      if (mediaType != "Song") {
        const { data } = await axios.get(` 
     https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${TMDB_KEY}`);
        const dataSlice = data.cast;
        setCredits(dataSlice);
      } else {
        const AUTH_URL = "https://accounts.spotify.com/api/token";
        const response = await axios.post(
          AUTH_URL,
          {
            grant_type: "client_credentials",
            client_id: SPOTIFY_CLIENT_ID,
            client_secret: SPOTIFY_CLIENT_SECRET,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const access_token = response.data.access_token;

        const { data } = await axios.get(
          `https://api.spotify.com/v1/tracks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "appliation/json",
            },
          }
        );

        const { data: res } = await axios.get(
          `https://api.spotify.com/v1/artists/${data.artists[0].id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "appliation/json",
            },
          }
        );

        const required = [
          {
            profile_path: res.images[0].url,
            original_name: res.name,
            character: "artist",
          },
        ];

        setCredits(required);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCredits();
  }, []);

  console.log(credits);

  return (
    <AliceCarousel
      infinite
      disableDotsControls
      mouseTracking
      items={items}
      responsive={responsive}
    />
  );
};

export default Gallery;
