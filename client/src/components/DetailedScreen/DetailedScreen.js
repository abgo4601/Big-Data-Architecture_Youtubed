import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import RecommendedSites from '../RecommendedSites/RecommendedSites';

const DetailedScreen = (props) => {
    return (
        <div>
          <Container fluid>
<Row>
    <Col md = {6}>
        <img src = {props.movies[0].img} style={{ width: "100%", height : '100vh'}}/>
    </Col>

    <Col md = {6}>
        <Row>
            <h1>{props.movies[0].name}</h1>
        </Row>
        <br></br>
        <Row>
           <Col>
           <h5>Director</h5>
           </Col>
           <Col>
           <h5>Writer</h5>
           </Col>
        </Row>
        <Row>
           <Col>
           <h5>Cast</h5>
           </Col>
        </Row>
        <Row>
            <p>{props.movies[0].summary}</p>
        </Row>
        <Row>
            <RecommendedSites name= {props.movies[0].name}/>
        </Row>
    </Col>
</Row>
<Row>
    <Col>
    <h4>Recent Comments </h4>
        <Row>
        <Stack gap={3}>
      <div className="bg-light border">First item</div>
      <div className="bg-light border">Second item</div>
      <div className="bg-light border">Third item</div>
        </Stack>
        </Row>
    </Col>
    <Col>
    <h4>Some Visualization</h4>
    </Col>
   
</Row>
          </Container> 

        </div>
    );
};

export default DetailedScreen;