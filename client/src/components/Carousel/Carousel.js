import axios from "axios";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { img_300, noPicture } from "../../images/Default";
import "./Carousel.css";
const handleDragStart = (e) => e.preventDefault();

const TMDB_KEY = "dfe8923f3e487ce951bd22dcd3dfccfc";

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
        <img
          src={n.profile_path ? `${img_300}/${n.profile_path}` : noPicture}
          alt=''
          className='caro_img'
          onDragStart={handleDragStart}
        />
        <div className='caro__details'>
          <h6 className='cast__name'>{n.original_name}</h6>
          <h6 className='character'>{n.character}</h6>
        </div>
      </div>
    );
  });

  const fetchCredits = async () => {
    try {
      const { data } = await axios.get(` 
     https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${TMDB_KEY}`);
      const dataSlice = data.cast;
      setCredits(dataSlice);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCredits();
  }, [credits]);

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
