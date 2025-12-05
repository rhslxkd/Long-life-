import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Real from "./components/Real";
import logo from './asset/images/real.png';
import logo2 from './asset/images/dangn.png';
import './App.css';


function App() {
    return (
        // <BrowserRouter>
        //     <Routes>
        //         <Route path="/estateBoard" element={<EstateBoard />} />
        //     </Routes>
        // </BrowserRouter>

        <div className="App">
            {/*<Header logo={logo}/>*/}
            <Header logo={logo2}/>
            <Real/>
        </div>

);
}

export default App;
