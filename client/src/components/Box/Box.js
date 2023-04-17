import React, {useState} from 'react';
import './Box.css';

function Box({handleShow, movie, renderTooltip}) {
    const [hover, setHover] = useState(false);
    // {
    //     "image": "https://image.tmdb.org/t/p/original/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    //     "popularity": 73.931,
    //     "release_date": "Thu, 16 Jan 2014 00:00:00 GMT",
    //     "summary": "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
    //     "title": "Whiplash",
    //     "voteAverage": 8.377,
    //     "voteCount": 13339
    // }

    return (
        <div className='box' onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} onMouseLeave={() => setHover(false)}>
            {!hover ? <img className='box--image' src={movie.image}/> : <div className='box--data'>{movie.title}</div>}
        </div>
    );
}

export default Box;