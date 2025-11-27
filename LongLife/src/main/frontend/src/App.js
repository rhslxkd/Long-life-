import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom";
import AdminRouter from "./router/AdminRouter";
import UserRouter from "./router/UserRouter";
import PublicRouter from "./router/PublicRouter";

function App() {
  return (
    <Routes>
        {AdminRouter()}
        {UserRouter()}
        {PublicRouter()}
    </Routes>
  );
}

export default App;
