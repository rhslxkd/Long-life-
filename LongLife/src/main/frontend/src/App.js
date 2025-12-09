import './App.css';
import {Route, Routes} from "react-router-dom";
import AdminRouter from "./router/AdminRouter";
import UserRouter from "./router/UserRouter";
import PublicRouter from "./router/PublicRouter";
import {RequestsProvider} from "./longlife/friends/RequestContext";
import AiChatPage from "./longlife/ai/AiChatPage";


function App() {

    return (
        <RequestsProvider>
            <Routes>
                {AdminRouter()}
                {UserRouter()}
                {PublicRouter()}
            </Routes>
            <AiChatPage/>
        </RequestsProvider>
    );
}

export default App;



