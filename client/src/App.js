import './App.css';
import Header from "./components/Header/Header";
import List from "./components/List/List";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function App() {

    const arr = [{type: 'Movies', list: ["The Godfather", "Fight Club", "3 Idiots"]}, {
        type: 'Movies', list: ["The Godfather", "Fight Club", "3 Idiots"]
    }, {type: 'Movies', list: ["The Godfather", "Fight Club", "3 Idiots"]}];

    const movies = [
        {
        "name" : "The Godfather",
        "genre": "Action",
          "img" : "https://media.npr.org/assets/img/2022/03/10/marlon-brandon-the-godfather_custom-e18469fdceae838fc9057f1f9ab1ddb019a66670-s1100-c50.jpg",
          "duration" : "126",
          "summary" : "Widely regarded as one of the greatest films of all time, this mob drama, based on Mario Puzo's novel of the same name, focuses on the powerful Italian-American crime family of Don Vito Corleone (Marlon Brando). ",
          "Ratings" : "5"
        }
      ];

    return (<div>
        <Header/>
        <div className='body'>
            {/* {arr.map((a, i) => <List type={a.type} list={a.list}/>)}  */}
           
            <List movies= {movies} name = "Movies"/>
        
        </div>
    </div>);
}

export default App;


