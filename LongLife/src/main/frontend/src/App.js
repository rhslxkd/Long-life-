import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import AdminRouter from "./router/AdminRouter";
import UserRouter from "./router/UserRouter";
import PublicRouter from "./router/PublicRouter";
import AiChatPage from "./longlife/ai/AiChatPage";


function App() {

    return (
        <div className="App">
            <Routes>
                {AdminRouter()}
                {UserRouter()}
                {PublicRouter()}
            </Routes>
            <AiChatPage />
        </div>
    );
}

export default App;



