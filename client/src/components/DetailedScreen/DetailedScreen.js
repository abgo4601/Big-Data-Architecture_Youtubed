import React from 'react';
import './DetailedScreen.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import CastCards from '../CastCards/CastCards';
import RecommendedSites from '../RecommendedSites/RecommendedSites';


const DetailedScreen = (props) => {
    const movie = {
        "image": "https://image.tmdb.org/t/p/original/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
        "popularity": 73.931,
        "release_date": "Thu, 16 Jan 2014 00:00:00 GMT",
        "summary": "Andrew Neiman (Miles Teller) is an ambitious young jazz drummer, in pursuit of rising to the top of his elite music conservatory. Terence Fletcher (J.K. Simmons), an instructor known for his terrifying teaching methods, discovers Andrew and transfers the aspiring drummer into the top jazz ensemble, forever changing the young man's life. But Andrew's passion to achieve perfection quickly spirals into obsession, as his ruthless teacher pushes him to the brink of his ability and his sanity.",
        "title": "Whiplash",
        "voteAverage": 8.377,
        "voteCount": 13339
    }
    return (
        // <div className='detailed-screen'>
        //     <img className='detailed-screen--image' src={movie.image} />
        //     <div className='detailed-screen--data'>
        //         <div>Genre: </div>
        //         <div>Length</div>
        //         <div>Released Date</div>
        //         <div>popularity</div>
        //     </div>
        // </div>
        <div>
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <img src={movie.image} style={{ width: "100%", height: '100vh' }} />
                    </Col>

                    <Col md={6}>
                        <Row>
                            <h1>{movie.title}</h1>
                        </Row>
                        <br></br>
                        <Row>
                            <Col>
                                <h5>Popularity</h5>
                            </Col>
                            <Col>
                                <h5>Released Date</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h5>Genre</h5>
                            </Col>
                        </Row>
                        <Row>
                            <p>{movie.summary}</p>
                        </Row>
                        <Row>
                            <RecommendedSites name={movie.title} />
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <CastCards />
                </Row>
            </Container>

        </div>
    );
};

export default DetailedScreen;