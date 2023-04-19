import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import DetailedScreen from '../DetailedScreen/DetailedScreen';
import './List.css';
import Box from "../Box/Box";

function List(props) {
    console.log(props);
    console.log(props.movies[0]);

    const arr = {
        "image": "https://image.tmdb.org/t/p/original/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
        "popularity": 73.931,
        "release_date": "Thu, 16 Jan 2014 00:00:00 GMT",
        "summary": "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
        "title": "Whiplash",
        "voteAverage": 8.377,
        "voteCount": 13339
    }
    const dummyArr = {
        movies: [{
            "image": "https://image.tmdb.org/t/p/original/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
            "popularity": 73.931,
            "release_date": "Thu, 16 Jan 2014 00:00:00 GMT",
            "summary": "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
            "title": "Whiplash",
            "voteAverage": 8.377,
            "voteCount": 13339
        }, {
            "image": "https://image.tmdb.org/t/p/original/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
            "popularity": 73.931,
            "release_date": "Thu, 16 Jan 2014 00:00:00 GMT",
            "summary": "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
            "title": "Whiplash",
            "voteAverage": 8.377,
            "voteCount": 13339
        }, {
            "image": "https://image.tmdb.org/t/p/original/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
            "popularity": 73.931,
            "release_date": "Thu, 16 Jan 2014 00:00:00 GMT",
            "summary": "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
            "title": "Whiplash",
            "voteAverage": 8.377,
            "voteCount": 13339
        }, {
            "image": "https://image.tmdb.org/t/p/original/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
            "popularity": 73.931,
            "release_date": "Thu, 16 Jan 2014 00:00:00 GMT",
            "summary": "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
            "title": "Whiplash",
            "voteAverage": 8.377,
            "voteCount": 13339
        }, {
            "image": "https://image.tmdb.org/t/p/original/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
            "popularity": 73.931,
            "release_date": "Thu, 16 Jan 2014 00:00:00 GMT",
            "summary": "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
            "title": "Whiplash",
            "voteAverage": 8.377,
            "voteCount": 13339
        }, {
            "image": "https://image.tmdb.org/t/p/original/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
            "popularity": 73.931,
            "release_date": "Thu, 16 Jan 2014 00:00:00 GMT",
            "summary": "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
            "title": "Whiplash",
            "voteAverage": 8.377,
            "voteCount": 13339
        }, {
            "image": "https://image.tmdb.org/t/p/original/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
            "popularity": 73.931,
            "release_date": "Thu, 16 Jan 2014 00:00:00 GMT",
            "summary": "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
            "title": "Whiplash",
            "voteAverage": 8.377,
            "voteCount": 13339
        }, {
            "image": "https://image.tmdb.org/t/p/original/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
            "popularity": 73.931,
            "release_date": "Thu, 16 Jan 2014 00:00:00 GMT",
            "summary": "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
            "title": "Whiplash",
            "voteAverage": 8.377,
            "voteCount": 13339
        },],
        tvShows: [
            {
                "image": "https://image.tmdb.org/t/p/original/dXQCEjVth8P8L47XIsoRt0oL8Gw.jpg",
                "popularity": 11.217,
                "release_date": "Fri, 20 Mar 2020 00:00:00 GMT",
                "summary": "A zoo owner spirals out of control amid a cast of eccentric characters in this true murder-for-hire story from the underworld of big cat breeding.",
                "title": "Tiger King",
                "voteAverage": 6.925,
                "voteCount": 339
            }, {
                "image": "https://image.tmdb.org/t/p/original/dXQCEjVth8P8L47XIsoRt0oL8Gw.jpg",
                "popularity": 11.217,
                "release_date": "Fri, 20 Mar 2020 00:00:00 GMT",
                "summary": "A zoo owner spirals out of control amid a cast of eccentric characters in this true murder-for-hire story from the underworld of big cat breeding.",
                "title": "Tiger King",
                "voteAverage": 6.925,
                "voteCount": 339
            }, {
                "image": "https://image.tmdb.org/t/p/original/dXQCEjVth8P8L47XIsoRt0oL8Gw.jpg",
                "popularity": 11.217,
                "release_date": "Fri, 20 Mar 2020 00:00:00 GMT",
                "summary": "A zoo owner spirals out of control amid a cast of eccentric characters in this true murder-for-hire story from the underworld of big cat breeding.",
                "title": "Tiger King",
                "voteAverage": 6.925,
                "voteCount": 339
            }, {
                "image": "https://image.tmdb.org/t/p/original/dXQCEjVth8P8L47XIsoRt0oL8Gw.jpg",
                "popularity": 11.217,
                "release_date": "Fri, 20 Mar 2020 00:00:00 GMT",
                "summary": "A zoo owner spirals out of control amid a cast of eccentric characters in this true murder-for-hire story from the underworld of big cat breeding.",
                "title": "Tiger King",
                "voteAverage": 6.925,
                "voteCount": 339
            }, {
                "image": "https://image.tmdb.org/t/p/original/dXQCEjVth8P8L47XIsoRt0oL8Gw.jpg",
                "popularity": 11.217,
                "release_date": "Fri, 20 Mar 2020 00:00:00 GMT",
                "summary": "A zoo owner spirals out of control amid a cast of eccentric characters in this true murder-for-hire story from the underworld of big cat breeding.",
                "title": "Tiger King",
                "voteAverage": 6.925,
                "voteCount": 339
            }, {
                "image": "https://image.tmdb.org/t/p/original/dXQCEjVth8P8L47XIsoRt0oL8Gw.jpg",
                "popularity": 11.217,
                "release_date": "Fri, 20 Mar 2020 00:00:00 GMT",
                "summary": "A zoo owner spirals out of control amid a cast of eccentric characters in this true murder-for-hire story from the underworld of big cat breeding.",
                "title": "Tiger King",
                "voteAverage": 6.925,
                "voteCount": 339
            }, {
                "image": "https://image.tmdb.org/t/p/original/dXQCEjVth8P8L47XIsoRt0oL8Gw.jpg",
                "popularity": 11.217,
                "release_date": "Fri, 20 Mar 2020 00:00:00 GMT",
                "summary": "A zoo owner spirals out of control amid a cast of eccentric characters in this true murder-for-hire story from the underworld of big cat breeding.",
                "title": "Tiger King",
                "voteAverage": 6.925,
                "voteCount": 339
            }, {
                "image": "https://image.tmdb.org/t/p/original/dXQCEjVth8P8L47XIsoRt0oL8Gw.jpg",
                "popularity": 11.217,
                "release_date": "Fri, 20 Mar 2020 00:00:00 GMT",
                "summary": "A zoo owner spirals out of control amid a cast of eccentric characters in this true murder-for-hire story from the underworld of big cat breeding.",
                "title": "Tiger King",
                "voteAverage": 6.925,
                "voteCount": 339
            }, {
                "image": "https://image.tmdb.org/t/p/original/dXQCEjVth8P8L47XIsoRt0oL8Gw.jpg",
                "popularity": 11.217,
                "release_date": "Fri, 20 Mar 2020 00:00:00 GMT",
                "summary": "A zoo owner spirals out of control amid a cast of eccentric characters in this true murder-for-hire story from the underworld of big cat breeding.",
                "title": "Tiger King",
                "voteAverage": 6.925,
                "voteCount": 339
            },
        ],
        songs: [{
            "album": "Smells Like Teen Spirit (Arr. for Harp by Alexander Boldachev)",
            "artist": "Kurt Cobain",
            "externalUrl": "https://open.spotify.com/track/020QUTHjPxJ05XXaJbWEVv",
            "image": "https://i.scdn.co/image/ab67616d00001e022a3e8c8a6e4a34d361178718",
            "popularity": 24,
            "previewUrl": "https://p.scdn.co/mp3-preview/e9d88225b250703eaa941b72e91a8acc989137f1?cid=580c268cc1c142abb5e4697ca23b19a4",
            "releaseDate": "2023-04-07",
            "title": "Smells Like Teen Spirit - Arr. for Harp by Alexander Boldachev"
        }, {
            "album": "Smells Like Teen Spirit (Arr. for Harp by Alexander Boldachev)",
            "artist": "Kurt Cobain",
            "externalUrl": "https://open.spotify.com/track/020QUTHjPxJ05XXaJbWEVv",
            "image": "https://i.scdn.co/image/ab67616d00001e022a3e8c8a6e4a34d361178718",
            "popularity": 24,
            "previewUrl": "https://p.scdn.co/mp3-preview/e9d88225b250703eaa941b72e91a8acc989137f1?cid=580c268cc1c142abb5e4697ca23b19a4",
            "releaseDate": "2023-04-07",
            "title": "Smells Like Teen Spirit - Arr. for Harp by Alexander Boldachev"
        }, {
            "album": "Smells Like Teen Spirit (Arr. for Harp by Alexander Boldachev)",
            "artist": "Kurt Cobain",
            "externalUrl": "https://open.spotify.com/track/020QUTHjPxJ05XXaJbWEVv",
            "image": "https://i.scdn.co/image/ab67616d00001e022a3e8c8a6e4a34d361178718",
            "popularity": 24,
            "previewUrl": "https://p.scdn.co/mp3-preview/e9d88225b250703eaa941b72e91a8acc989137f1?cid=580c268cc1c142abb5e4697ca23b19a4",
            "releaseDate": "2023-04-07",
            "title": "Smells Like Teen Spirit - Arr. for Harp by Alexander Boldachev"
        }, {
            "album": "Smells Like Teen Spirit (Arr. for Harp by Alexander Boldachev)",
            "artist": "Kurt Cobain",
            "externalUrl": "https://open.spotify.com/track/020QUTHjPxJ05XXaJbWEVv",
            "image": "https://i.scdn.co/image/ab67616d00001e022a3e8c8a6e4a34d361178718",
            "popularity": 24,
            "previewUrl": "https://p.scdn.co/mp3-preview/e9d88225b250703eaa941b72e91a8acc989137f1?cid=580c268cc1c142abb5e4697ca23b19a4",
            "releaseDate": "2023-04-07",
            "title": "Smells Like Teen Spirit - Arr. for Harp by Alexander Boldachev"
        }, {
            "album": "Smells Like Teen Spirit (Arr. for Harp by Alexander Boldachev)",
            "artist": "Kurt Cobain",
            "externalUrl": "https://open.spotify.com/track/020QUTHjPxJ05XXaJbWEVv",
            "image": "https://i.scdn.co/image/ab67616d00001e022a3e8c8a6e4a34d361178718",
            "popularity": 24,
            "previewUrl": "https://p.scdn.co/mp3-preview/e9d88225b250703eaa941b72e91a8acc989137f1?cid=580c268cc1c142abb5e4697ca23b19a4",
            "releaseDate": "2023-04-07",
            "title": "Smells Like Teen Spirit - Arr. for Harp by Alexander Boldachev"
        }, {
            "album": "Smells Like Teen Spirit (Arr. for Harp by Alexander Boldachev)",
            "artist": "Kurt Cobain",
            "externalUrl": "https://open.spotify.com/track/020QUTHjPxJ05XXaJbWEVv",
            "image": "https://i.scdn.co/image/ab67616d00001e022a3e8c8a6e4a34d361178718",
            "popularity": 24,
            "previewUrl": "https://p.scdn.co/mp3-preview/e9d88225b250703eaa941b72e91a8acc989137f1?cid=580c268cc1c142abb5e4697ca23b19a4",
            "releaseDate": "2023-04-07",
            "title": "Smells Like Teen Spirit - Arr. for Harp by Alexander Boldachev"
        }, {
            "album": "Smells Like Teen Spirit (Arr. for Harp by Alexander Boldachev)",
            "artist": "Kurt Cobain",
            "externalUrl": "https://open.spotify.com/track/020QUTHjPxJ05XXaJbWEVv",
            "image": "https://i.scdn.co/image/ab67616d00001e022a3e8c8a6e4a34d361178718",
            "popularity": 24,
            "previewUrl": "https://p.scdn.co/mp3-preview/e9d88225b250703eaa941b72e91a8acc989137f1?cid=580c268cc1c142abb5e4697ca23b19a4",
            "releaseDate": "2023-04-07",
            "title": "Smells Like Teen Spirit - Arr. for Harp by Alexander Boldachev"
        }, {
            "album": "Smells Like Teen Spirit (Arr. for Harp by Alexander Boldachev)",
            "artist": "Kurt Cobain",
            "externalUrl": "https://open.spotify.com/track/020QUTHjPxJ05XXaJbWEVv",
            "image": "https://i.scdn.co/image/ab67616d00001e022a3e8c8a6e4a34d361178718",
            "popularity": 24,
            "previewUrl": "https://p.scdn.co/mp3-preview/e9d88225b250703eaa941b72e91a8acc989137f1?cid=580c268cc1c142abb5e4697ca23b19a4",
            "releaseDate": "2023-04-07",
            "title": "Smells Like Teen Spirit - Arr. for Harp by Alexander Boldachev"
        }, {
            "album": "Smells Like Teen Spirit (Arr. for Harp by Alexander Boldachev)",
            "artist": "Kurt Cobain",
            "externalUrl": "https://open.spotify.com/track/020QUTHjPxJ05XXaJbWEVv",
            "image": "https://i.scdn.co/image/ab67616d00001e022a3e8c8a6e4a34d361178718",
            "popularity": 24,
            "previewUrl": "https://p.scdn.co/mp3-preview/e9d88225b250703eaa941b72e91a8acc989137f1?cid=580c268cc1c142abb5e4697ca23b19a4",
            "releaseDate": "2023-04-07",
            "title": "Smells Like Teen Spirit - Arr. for Harp by Alexander Boldachev"
        },]
    }

    const [show, setShow] = useState(false);
    const [modalSummary, setModalSummary] = useState('');
    const currentSummary = '';

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Detailed suggestions and analytics
        </Tooltip>
    );

    function handleClose() {
        setShow(false);
    }

    function handleShow(summary) {
        console.log(summary);

        setModalSummary(summary);
        setShow(true);
    }

    const currentMovies = props.movies;
    return (

        <div>

            <Container>
                <h3>{props.type}</h3>
                <h1>{props.name}</h1>
                <div className="row">
                    {dummyArr.movies.map((movie, idx) => (
                        <Box movie={movie} handleShow={handleShow} renderTooltip={renderTooltip} />
                    ))}
                </div>
                <div className="row">
                    <h3>Tv Shows</h3>
                    {dummyArr.tvShows.map((movie, idx) => (
                        <Box movie={movie} handleShow={handleShow} renderTooltip={renderTooltip} />
                    ))}
                </div>
                <div className="row">
                    <h3>Songs</h3>
                    {dummyArr.songs.map((movie, idx) => (
                        <Box movie={movie} handleShow={handleShow} renderTooltip={renderTooltip} />
                    ))}
                </div>

            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Summary</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalSummary}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>

    );
}

export default List;