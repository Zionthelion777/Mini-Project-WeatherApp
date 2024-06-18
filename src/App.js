import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; 
// import logo from './logo.svg';
import Home from './components/Home';
import FriendsMap from './components/FriendsMap';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import TemperatureMap from "./components/TemperatureMap";
import PrecipitationMap from "./components/PrecipitationMap";
import WindMap from "./components/WindMap";

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
        <Route exact path="/temperature-map" element={<TemperatureMap/>} />
        <Route exact path="/precipitation-map" element={<PrecipitationMap/>} />
        <Route exact path="/wind-map" element={<WindMap/>} />

      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;