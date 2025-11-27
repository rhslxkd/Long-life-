import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom";
import AiChatPage from "./longlife/ai/AiChatPage";


function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/ai-chat" element={<AiChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
