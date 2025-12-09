import './App.css';
import {Route, Routes} from "react-router-dom";
import AdminRouter from "./router/AdminRouter";
import UserRouter from "./router/UserRouter";
import PublicRouter from "./router/PublicRouter";
import {RequestsProvider} from "./longlife/friends/RequestContext";


function App() {

    return (
        <RequestsProvider>
            <Routes>
                {AdminRouter()}
                {UserRouter()}
                {PublicRouter()}
            </Routes>
        </RequestsProvider>
    );
}

export default App;



