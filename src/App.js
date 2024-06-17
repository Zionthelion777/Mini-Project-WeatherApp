import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; 
// import logo from './logo.svg';
import Home from './components/Home';
import FriendsMap from './components/FriendsMap';
import Login from './components/Login';
import Register from './components/Register';
import WeatherMap from './components/WeatherMap';
import './App.css';

// Routing resource: https://itnext.io/react-router-54f31c1bb3a9
function App() {
  return (
    <BrowserRouter>
      <div className="App">
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/friends-map" element={<FriendsMap/>} />
        <Route path="/login" element={<Login/>} />
        <Route exact path="/register" element={<Register/>} />
        <Route exact path="/weather-map" element={<WeatherMap/>} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;