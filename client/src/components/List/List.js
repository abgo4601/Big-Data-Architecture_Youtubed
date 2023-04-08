import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

function List(props) {
    console.log(props);
    console.log(props.movies[0]);
    
    //console.log(arr[0].name);
    return (
        // <div>
        //     <h3>{props.type}</h3>
        //     <h3>{props.img}</h3>
        //     {props.list.map((li, i) => {
        //         return <div key={i}>{li}</div>
        //     })}
        // </div>

        <div>
       
 <Container >
 <h3>{props.type}</h3>
 <h1>{props.name}</h1>
    <Row xs={1} md={4} className="g-4">
           
      {Array.from({ length: 8 }).map((_, idx) => (
        <Col>
          <Card>
          <Card.Img style={{ width: 'auto', height : '200px'}} variant="top" src= {props.movies[0].img} />
          <Card.Body>
            <Card.Title>{props.movies[0].name}</Card.Title>
            <Card.Text>
                {/* {props.movies[0].summary} */}
             
            </Card.Text>
            <p1 style={{ color: 'red' }} >Genre :   </p1>
            <p1>{props.movies[0].genre} </p1> 
            <br></br>
            <p1 style={{ color: 'red' }} > Ratings: </p1> 5/5
            <br></br>
            <p1 style={{ color: 'red' }} > Length: </p1> {props.movies[0].duration}
            <hr></hr>
            <Button variant="danger">More Details</Button>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
 
  </Container>
        </div>

    );
}
export default List;