import './App.css';
import Header from "./components/Header/Header";
import List from "./components/List/List";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

     const arr = [{type: 'Movies', list: ["The Godfather", "Fight Club", "3 Idiots"], img: 'https://media.npr.org/assets/img/2022/03/10/marlon-brandon-the-godfather_custom-e18469fdceae838fc9057f1f9ab1ddb019a66670-s1100-c50.jpg'}, {
         type: 'Tv Shows', list: ["The Godfather", "Fight Club", "3 Idiots"] , img: 'https://media.npr.org/assets/img/2022/03/10/marlon-brandon-the-godfather_custom-e18469fdceae838fc9057f1f9ab1ddb019a66670-s1100-c50.jpg'
     }, {type: 'Podcasts', list: ["The Godfather", "Fight Club", "3 Idiots"],  img: 'https://media.npr.org/assets/img/2022/03/10/marlon-brandon-the-godfather_custom-e18469fdceae838fc9057f1f9ab1ddb019a66670-s1100-c50.jpg' }];


    return (<div>
        <Header/>
        <div className='body'>
            {arr.map((a, i) => <List type={a.type} list={a.list} img={a.img} />)}
            <button>Hello</button>
        </div>
    </div>);
}

export default App;
