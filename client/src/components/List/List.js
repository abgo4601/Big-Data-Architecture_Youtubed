import React, {useState} from 'react';
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

function List(props) {
    console.log(props);
    console.log(props.movies[0]);

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
          <Card bg= "dark"
          text='white'
         
          className="mb-2">
          
          <Card.Img onClick={() => handleShow(props.movies[0].summary)} style={{ width: 'auto', height : '200px'}} variant="top" src= {props.movies[0].img } />
          <Card.Body>
            {/* <Card.Title>{props.movies[0].name}</Card.Title> */}
            <Card.Text>
            {props.movies[0].name}
             
            </Card.Text>
            <Row>
                <Col>
                <p1 style={{ color: 'red' }} >Genre :   </p1>
                <p1>{props.movies[0].genre} </p1> 
                </Col>
                <Col>
                <p1 style={{ color: 'red' }} > Ratings: </p1> 5/5
                </Col>
            </Row>
            <Row>
            <Col>
            <p1 style={{ color: 'red' }} > Length: </p1> {props.movies[0].duration} mins
            </Col>
            <Col>
            <p1 style={{ color: 'red' }}  onClick={() => handleShow(props.movies[0].summary)}>Summary</p1>
            </Col>
            </Row>
            <hr></hr>
            <OverlayTrigger
      placement="right"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <Button variant="danger">More Details</Button>
    </OverlayTrigger>
            {/* <Button variant="danger">More Details</Button> */}
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
 
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