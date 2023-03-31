import './App.css';
import Header from "./components/Header/Header";
import List from "./components/List/List";

function App() {

    const arr = [{type: 'Movies', list: ["The Godfather", "Fight Club", "3 Idiots"]}, {
        type: 'Movies', list: ["The Godfather", "Fight Club", "3 Idiots"]
    }, {type: 'Movies', list: ["The Godfather", "Fight Club", "3 Idiots"]}];

    return (<div>
        <Header/>
        <div className='body'>
            {arr.map((a, i) => <List type={a.type} list={a.list}/>)}
        </div>
    </div>);
}

export default App;
