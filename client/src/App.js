import './App.css';
import Header from "./components/Header/Header";
import List from "./components/List/List";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import DetailedScreen from './components/DetailedScreen/DetailedScreen';

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
          "summary" : "The Godfather Don Vito Corleone is the head of the Corleone mafia family in New York. He is at the event of his daughter's wedding. Michael, Vito's youngest son and a decorated WW II Marine is also present at the wedding. Michael seems to be uninterested in being a part of the family business. Vito is a powerful man, and is kind to all those who give him respect but is ruthless against those who do not. But when a powerful and treacherous rival wants to sell drugs and needs the Don's influence for the same, Vito refuses to do it. What follows is a clash between Vito's fading old values and the new ways which may cause Michael to do the thing he was most reluctant in doing and wage a mob war against all the other mafia families which could tear the Corleone family apart",
          "Ratings" : "5"
        }
      ];

    return (<div>
         <Router>
        <Header/>
        <Routes>
        <Route path='/' element={<List  movies= {movies} name = "Movies"/>}  />
        <Route path='/home' element={<List  movies= {movies} name = "Movies"/>} exact />
        <Route path='/details' element={<DetailedScreen movies= {movies} />} exact />
        </Routes>
        </Router>
    </div>
    );

}

export default App;


