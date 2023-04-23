import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import Home from "./screens/Home/Home";
import SinglePage from "./components/SingleContent/SingleContentPage";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/login' element={<SignIn />} />
          <Route path='/home' element={<Home />} exact />
          <Route path='/:mediaType/:id' element={<SinglePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
