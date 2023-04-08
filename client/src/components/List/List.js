import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

function List(props) {
    
    return (
        // <div>
        //     <h3>{props.type}</h3>
        //     <h3>{props.img}</h3>
        //     {props.list.map((li, i) => {
        //         return <div key={i}>{li}</div>
        //     })}
        // </div>

        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>

    );
}
export default List;