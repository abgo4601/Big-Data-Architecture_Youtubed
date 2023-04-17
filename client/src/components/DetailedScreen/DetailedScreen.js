import React from 'react';
import './DetailedScreen.css'

const DetailedScreen = (props) => {
    const movie = {
        "image": "https://image.tmdb.org/t/p/original/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
        "popularity": 73.931,
        "release_date": "Thu, 16 Jan 2014 00:00:00 GMT",
        "summary": "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
        "title": "Whiplash",
        "voteAverage": 8.377,
        "voteCount": 13339
    }
    return (
        <div className='detailed-screen'>
            <img className='detailed-screen--image' src={movie.image} />
            <div className='detailed-screen--data'>
                <div>name</div>
                <div>name</div>
                <div>name</div>
                <div>name</div>
            </div>
        </div>
    );
};

export default DetailedScreen;