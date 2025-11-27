import logo from './logo.svg';
import './App.css';
import {useState,useEffect} from "react";
import {Route, Navigate, useLocation} from "react-router-dom";
import { BrowserRouter as Router, Routes, useRoutes } from 'react-router-dom';
import ExerciseStoryList from "./story/ExerciseStoryList";
import Home from "./story/Home";

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exerciseStoryList" element={<ExerciseStoryList />} />
        </Routes>
      </Router>
  );
}

export default App;
