import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Row';

function List(props) {
    console.log(props);
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
    <Row xs={1} md={4} className="g-4">
           
      {Array.from({ length: 8 }).map((_, idx) => (
        <Col>
          <Card>
          <Card.Img style={{ width: '300px', height : '200px'}} variant="top" src= {props.img} />
          <Card.Body>
            <Card.Title>Card title</Card.Title>
            <Card.Text>
                {props.type}
              This is a longer card with supporting text below as a natural
              lead-in to additional content. This content is a little bit
              longer.
            </Card.Text>
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