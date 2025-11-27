import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Calendar from "./longlife/session/Calendar";
import Session from "./longlife/session/Session";


function App() {
    return (
        <div>
            <Routes>
                <Route path="/calendar" element={<Calendar/>}/>
                <Route path="/workout/session/:formDate" element={<Session/>}/>
            </Routes>
        </div>
    );
}

export default App;
