import React from "react";
import { useNavigate } from "react-router-dom";
import MuiPlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { styled } from "@mui/material/styles";
import "./SingleData.css";
import { img_300, unavailable } from "../../images/Default";

const PlayArrowRoundedIcon = styled(MuiPlayArrowRoundedIcon)(`

  &.MuiSvgIcon-root{
    color:#abb7c4 ;
  },  &.MuiSvgIcon-root:hover {
    color: #d13131 ;
  }
  
`);

const SingleData = ({
  poster_path,
  title,
  name,
  id,
  vote_average,
  release_date,
  first_air_date,
  mediaType,
  media_type,
}) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(`/${mediaType || media_type}/${id}`);
  };
  const setVoteClass = (vote) => {
    if (vote >= 8) {
      return "green";
    } else if (vote >= 6) {
      return "orange";
    } else {
      return "red";
    }
  };

  return (
    <>
      <div
        style={{ color: "white" }}
        className='SingleDataMedia'
        onClick={handleClick}
      >
        <span className={` tag ${setVoteClass(vote_average)} vote__tag`}>
          {Math.round(vote_average * 10) / 10}
        </span>
        <div>
          {mediaType !== "Song" ? (
            <img
              src={poster_path ? `${img_300}/${poster_path}` : unavailable}
              alt=''
            />
          ) : (
            <img src={poster_path} alt='' />
          )}
        </div>

        <div className='read__more'>
          <PlayArrowRoundedIcon
            style={{
              border: "2px solid #abb7c4",
              borderRadius: "50px",
              fontSize: "3.2rem",
              cursor: "pointer",
            }}
            className='play__btn'
          />
        </div>
        <div className='SingleDataDetails'>
          <h6>
            {title || name}(
            {(first_air_date || release_date || "-----").substring(0, 4)})
          </h6>
        </div>
      </div>
    </>
  );
};

export default SingleData;
