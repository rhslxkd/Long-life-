import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom";

import Register from "./longlife/users/Register";
import Login from "./longlife/users/Login";


function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
      </Routes>
    </div>
  );
}

export default App;
