import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import DinosauresList from './DinosauresList';
import Classique from './classique';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classique" element={<Classique />} />
        <Route path="/dinosaureslist" element={<DinosauresList />} />
      </Routes>
    </Router>
  );
}

export default App;
